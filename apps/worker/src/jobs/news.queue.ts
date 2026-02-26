import Bull from "bull";
export const newsQueue = new Bull("news-fetch", { redis: process.env.REDIS_URL ?? "redis://localhost:6379" });
