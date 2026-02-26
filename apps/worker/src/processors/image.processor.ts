import { Job } from "bull";
import { logger } from "../utils/logger";
export async function processImageJob(job: Job) {
  logger.info(`Processing image job ${job.id}`);
  // Handled synchronously in the API for now; async batch generation future feature
}
