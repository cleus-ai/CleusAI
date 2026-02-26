import winston from "winston";

export function createLogger(service: string) {
  return winston.createLogger({
    level: process.env.LOG_LEVEL ?? "info",
    defaultMeta: { service },
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), process.env.NODE_ENV === "production" ? winston.format.json() : winston.format.prettyPrint()),
    transports: [new winston.transports.Console()],
  });
}
