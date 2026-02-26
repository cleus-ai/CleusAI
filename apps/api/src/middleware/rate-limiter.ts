import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => { logger.warn(`Rate limit hit: ${req.ip}`); res.status(429).json({ error: "Too many requests. Slow down." }); },
});

export const strictRateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
