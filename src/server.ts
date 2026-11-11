import type { Server } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { WinstonLogger } from "./core/logger/winston-logger.js";

const logger = new WinstonLogger();

const server: Server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  logger.info(`Health check available at http://localhost:${env.PORT}/health`);
  logger.info(`API v1 routes available at http://localhost:${env.PORT}/api/v1`);
});

const SHUTDOWN_TIMEOUT_MS = 10000;

function handleShutdown(signal: string) {
  logger.info(`${signal} signal received: closing HTTP server gracefully...`);

  const forceExitTimeout = setTimeout(() => {
    logger.error("Forceful shutdown: connection draining timed out after 10s");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  forceExitTimeout.unref();

  server.close((err) => {
    clearTimeout(forceExitTimeout);
    if (err) {
      logger.error("Error during server shutdown:", { error: err });
      process.exit(1);
    }
    logger.info("HTTP server closed. Exiting process.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown:", { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection detected:", { reason });
  process.exit(1);
});
