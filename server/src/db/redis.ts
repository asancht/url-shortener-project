import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const strPort = process.env.REDIS_PORT as unknown as number;
const strHost = process.env.REDIS_HOST as string;

export const redis = new Redis({
  port: strPort,
  host: strHost
});