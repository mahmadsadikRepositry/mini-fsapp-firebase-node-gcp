// src/routes/triggerGpu.js
import fp from "fastify-plugin";
import axios from "axios";

export default fp(async function (fastify, opts) {
  const gpuUrl = process.env.GPU_SERVICE_URL;
  const gpuToken = process.env.GPU_SERVICE_TOKEN;

  fastify.post("/trigger-gpu", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      if (!authHeader.startsWith("Bearer ")) {
        return reply.code(401).send({ error: "Missing Authorization Bearer token" });
      }
      const idToken = authHeader.split(" ")[1];
      const decoded = await fastify.verifyFirebaseToken(idToken);
      const uid = decoded.uid;

      if (!gpuUrl) {
        return reply.code(503).send({ error: "GPU service not configured" });
      }

      // For simplicity, accept optional payload
      const payload = request.body || { uid };

      // Call GPU service (protected by token)
      const res = await axios.post(
        gpuUrl,
        payload,
        {
          headers: {
            "x-service-token": gpuToken,
          },
          timeout: 60_000
        }
      );

      return { status: "ok", gpuResult: res.data };
    } catch (err) {
      fastify.log.error(err?.response?.data || err.message || err);
      return reply.code(500).send({ error: "GPU call failed", details: err?.message });
    }
  });
});
