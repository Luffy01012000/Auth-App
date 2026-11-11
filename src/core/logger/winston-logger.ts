import winston from "winston";
import { env } from "../../config/env.js";
import type { ILogger } from "./logger.interface.js";

const { combine, timestamp, json, colorize, printf } = winston.format;

export class WinstonLogger implements ILogger {
  private readonly logger: winston.Logger;

  constructor() {
    const isProd = env.NODE_ENV === "production";

    const format = isProd
      ? combine(timestamp(), json())
      : combine(
          colorize(),
          timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
            return `[${timestamp}] [${level}]: ${message}${metaStr}`;
          }),
        );

    this.logger = winston.createLogger({
      level: env.LOG_LEVEL,
      format,
      transports: [new winston.transports.Console()],
      exitOnError: false,
    });
  }

  public debug(message: string, meta?: unknown): void {
    this.logger.debug(message, meta ? { meta } : undefined);
  }

  public info(message: string, meta?: unknown): void {
    this.logger.info(message, meta ? { meta } : undefined);
  }

  public warn(message: string, meta?: unknown): void {
    this.logger.warn(message, meta ? { meta } : undefined);
  }

  public error(message: string, meta?: unknown): void {
    this.logger.error(message, meta ? { meta } : undefined);
  }
}
