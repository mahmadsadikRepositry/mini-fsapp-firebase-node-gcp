// src/index.js
import dotenv from 'dotenv'
import Fastify from "fastify";
// import fastifyCors from "fastify-cors";
// import fastifyHelmet from "fastify-helmet";
import fastifySocketIO from "fastify-socket.io";
import eventsRoute from "./routes/events.js";
import triggerGpuRoute from "./routes/triggerGpu.js";
import { initRedis, redis, redisSub, CHANNEL } from "./redisClient.js";
import { auth as firebaseAuth, firestore } from "./firebaseAdmin.js";
import fp from "fastify-plugin";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
});

// // basic security plugins
// await server.register(fastifyHelmet);
// await server.register(fastifyCors, {
//   origin: true,
//   credentials: true,
// });

// register socket.io
await server.register(fastifySocketIO, {
  // options passed to socket.io
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

// attach redis clients to fastify instance for routes
server.decorate("redisClients", { redis, redisSub, CHANNEL });

// helper to verify firebase token
server.decorate("verifyFirebaseToken", async (idToken) => {
  if (!firebaseAuth) throw new Error("Firebase Admin SDK not initialized");
  const decoded = await firebaseAuth.verifyIdToken(idToken);
  return decoded;
});

// Register routes (these are fastify plugins)
// await server.register(fp(async (fastify) => {
//   fastify.decorate("verifyFirebaseToken", server.verifyFirebaseToken);
//   fastify.decorate("redisClients", server.redisClients);
// }));

await server.register(eventsRoute);
await server.register(triggerGpuRoute);

// Socket.IO connection handling
server.io.on("connection", async (socket) => {
  server.log.info(`Socket connected: ${socket.id}`);

  // Expect client to send token in 'auth' message
  socket.on("authenticate", async (data) => {
    try {
      const token = data?.token;
      if (!token) {
        socket.emit("unauthorized", { message: "no token" });
        socket.disconnect(true);
        return;
      }
      const decoded = await server.verifyFirebaseToken(token);
      const uid = decoded.uid;
      socket.join(uid); // room per user
      socket.data.uid = uid;

      // Send initial state: try Redis cache then Firestore
      let cached = null;
      if (redis) {
        const key = `user:counter:${uid}`;
        const val = await redis.get(key);
        if (val !== null) cached = parseInt(val, 10);
      }

      if (cached === null) {
        // fallback to Firestore value
        try {
          const doc = await firestore.doc(`users/${uid}`).get();
          if (doc.exists) cached = doc.data()?.counter || 0;
          else cached = 0;
        } catch (err) {
          server.log.warn("Failed to read from firestore", err);
          cached = 0;
        }
      }

      socket.emit("initial", { uid, counter: cached });

    } catch (err) {
      server.log.warn("Socket auth failed", err);
      socket.emit("unauthorized", { message: "auth failed" });
      socket.disconnect(true);
    }
  });

  socket.on("disconnect", (reason) => {
    server.log.info(`Socket ${socket.id} disconnected: ${reason}`);
  });
});

// Subscribe to redis channel and broadcast to sockets
if (redisSub) {
  redisSub.subscribe(CHANNEL, (err, count) => {
    if (err) {
      server.log.error("Failed to subscribe to redis channel", err);
    } else {
      server.log.info(`Subscribed to ${CHANNEL}`);
    }
  });

  redisSub.on("message", (channel, message) => {
    try {
      const data = JSON.parse(message);
      const { uid, counter } = data;
      server.log.info(`Publishing update for ${uid} => ${counter}`);
      // emit to room = uid
      server.io.to(uid).emit("counter-update", { uid, counter });
    } catch (err) {
      server.log.error("Malformed redis message", err);
    }
  });
}

// initialize redis and then start server
(async () => {
  if (redis) {
    try {
      await initRedis();
    } catch (err) {
      server.log.error("Redis init failed", err);
      // Not exiting because we can run without redis (but pub/sub disabled)
    }
  }

  try {
    await server.listen({ port: PORT, host: "0.0.0.0" });
    server.log.info(`Server listening on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
