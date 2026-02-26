import Bull from "bull";
export const videoQueue = new Bull("video-generation", { redis: process.env.REDIS_URL ?? "redis://localhost:6379" });
