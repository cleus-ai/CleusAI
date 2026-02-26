import { videoQueue } from "./jobs/video.queue";
import { imageQueue } from "./jobs/image.queue";
import { newsQueue } from "./jobs/news.queue";
import { processVideoJob } from "./processors/video.processor";
import { processImageJob } from "./processors/image.processor";
import { processNewsJob } from "./processors/news.processor";
import { logger } from "./utils/logger";
import dotenv from "dotenv";

dotenv.config();

videoQueue.process("generate", 2, processVideoJob);
imageQueue.process("generate", 5, processImageJob);
newsQueue.process("fetch", 1, processNewsJob);

// Schedule news fetch every 15 minutes
newsQueue.add("fetch", {}, { repeat: { cron: "*/15 * * * *" } });

logger.info("Worker started — processing video, image, news queues");

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, draining queues...");
  await Promise.all([videoQueue.close(), imageQueue.close(), newsQueue.close()]);
  process.exit(0);
});
