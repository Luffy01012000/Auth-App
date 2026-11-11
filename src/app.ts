import cors from "cors";
import express, { type Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { type Container, createContainer } from "./container.js";
import { createErrorHandler } from "./middlewares/error-handler.js";
import { notFoundHandler } from "./middlewares/not-found.js";
import { createRequestLogger } from "./middlewares/request-logger.js";
import { createHealthRouter } from "./modules/health/health.routes.js";
import { createApiRouter } from "./routes/index.js";

export function createApp(container: Container = createContainer()): Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(","),
      credentials: true,
    }),
  );

  // Rate limiting (skipped in test environment)
  if (env.NODE_ENV !== "test") {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per IP per window
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: {
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please try again later",
        },
      },
    });
    app.use("/api", limiter);
  }

  // Request body parsing
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Request logging (skipped in test environment)
  if (env.NODE_ENV !== "test") {
    app.use(createRequestLogger(container.logger));
  }

  // Top-level health endpoints for cluster probes (e.g. Kubernetes, AWS ECS)
  app.use("/health", createHealthRouter(container.healthController));

  // Versioned API routes
  app.use("/api", createApiRouter(container));

  // 404 handler
  app.use(notFoundHandler);

  // Centralized RFC-compliant error handler
  app.use(createErrorHandler(container.logger));

  return app;
}

export const app = createApp();
