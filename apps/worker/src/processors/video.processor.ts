import { Job } from "bull";
import Replicate from "replicate";
import { prisma } from "../utils/prisma";
import { logger } from "../utils/logger";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function processVideoJob(job: Job) {
  const { videoId, prompt, duration = 10, style = "Cinematic" } = job.data;
  logger.info(`Processing video job ${videoId}`);
  try {
    await prisma.generatedVideo.update({ where: { id: videoId }, data: { status: "PROCESSING" } });
    const output = await replicate.run("lumalabs/dream-machine:latest" as `${string}/${string}`, {
      input: { prompt: `${prompt}, ${style} style`, duration }
    });
    const videoUrl = Array.isArray(output) ? String(output[0]) : String(output);
    await prisma.generatedVideo.update({ where: { id: videoId }, data: { status: "COMPLETED", videoUrl } });
    logger.info(`Video job ${videoId} completed`);
  } catch (err) {
    logger.error({ msg: `Video job ${videoId} failed`, err });
    await prisma.generatedVideo.update({ where: { id: videoId }, data: { status: "FAILED" } });
    throw err;
  }
}
