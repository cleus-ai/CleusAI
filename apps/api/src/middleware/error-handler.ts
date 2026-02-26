import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error({ err, path: req.path, method: req.method });
  const status = err.status ?? err.statusCode ?? 500;
  const message = status < 500 ? err.message : "Internal server error";
  res.status(status).json({ error: message });
}
