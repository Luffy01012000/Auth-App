import type { RequestHandler } from "express";
import morgan from "morgan";
import { env } from "../config/env.js";
import type { ILogger } from "../core/logger/logger.interface.js";

export function createRequestLogger(logger: ILogger): RequestHandler {
  const format = env.NODE_ENV === "production" ? "combined" : "dev";

  return morgan(format, {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
    skip: () => env.NODE_ENV === "test",
  });
}
