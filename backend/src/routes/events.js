// src/routes/events.js
import fp from "fastify-plugin";

const EVENTS_PREFIX = "user:counter:";

export default fp(async function (fastify, opts) {
  const { redis, redisSub, CHANNEL } = fastify.redisClients;

  // POST /events
  // body: { type: 'click' } (only 'click' supported for now)
  fastify.post("/events", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      if (!authHeader.startsWith("Bearer ")) {
        return reply.code(401).send({ error: "Missing Authorization Bearer token" });
      }
      const idToken = authHeader.split(" ")[1];
      const decoded = await fastify.verifyFirebaseToken(idToken);
      const uid = decoded.uid;

      const { type } = request.body || {};
      if (type !== "click") {
        return reply.code(400).send({ error: "Unsupported event type" });
      }

      if (!redis) {
        // If Redis not configured, fallback: respond 503
        return reply.code(503).send({ error: "Redis not configured" });
      }

      const key = EVENTS_PREFIX + uid;
      // Use INCR to increment cached counter; set TTL if new key
      const newVal = await redis.incr(key);
      // Ensure TTL (short cache)
      const ttl = parseInt(process.env.REDIS_CACHE_TTL_SECONDS || "30");
      await redis.expire(key, ttl);

      // Publish update to channel for all instances
      await redis.publish(CHANNEL, JSON.stringify({ uid, counter: newVal }));

      return { uid, counter: newVal };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: "Server error" });
    }
  });
});
