import { Job } from "bull";
import axios from "axios";
import { logger } from "../utils/logger";

const CATEGORIES = ["general", "technology", "science", "business", "health", "entertainment"];

export async function processNewsJob(job: Job) {
  logger.info("Fetching latest news...");
  for (const category of CATEGORIES) {
    try {
      await axios.get("https://newsapi.org/v2/top-headlines", {
        params: { category, pageSize: 20, language: "en", apiKey: process.env.NEWS_API_KEY },
      });
      // In production: upsert articles to DB / Redis cache
      logger.info(`Fetched ${category} news`);
    } catch (err) {
      logger.error({ msg: `Failed to fetch ${category} news`, err });
    }
  }
}
