// src/redisClient.js
import Redis from "ioredis";
import dotenv from 'dotenv';

dotenv.config();
const host = process.env.REDIS_HOST;
console.log("REDIS_HOST",process.env.REDIS_HOST);
const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
const password = process.env.REDIS_PASSWORD || undefined;

if (!host) {
  console.warn("REDIS_HOST not set. Redis functionality will be disabled.");
}

export const redis = host
  ? new Redis({
      host,
      port,
      password,
      lazyConnect: true,
      // for GCP Memorystore with private IP, Cloud Run must be in same VPC via connector
    })
  : null;

  console.log("redis",redis);
  
// Separate subscriber to avoid interfering with normal commands
export const redisSub = host ? new Redis({ host, port, password }) : null;

export const CHANNEL = "counter-updates";

export async function initRedis() {
  if (!redis) return;
  try {
    await redis.connect();
    await redisSub.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connect error", err);
    process.exit(1);
  }
}
