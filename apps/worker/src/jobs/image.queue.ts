import Bull from "bull";
export const imageQueue = new Bull("image-generation", { redis: process.env.REDIS_URL ?? "redis://localhost:6379" });
