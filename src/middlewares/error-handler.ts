import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../core/errors/app-error.js";
import { ErrorCode } from "../core/errors/error-codes.js";
import { createErrorResponse } from "../core/http/api-response.js";
import type { ILogger } from "../core/logger/logger.interface.js";

export function createErrorHandler(logger: ILogger) {
  return (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError) {
      if (!err.isOperational) {
        logger.error("Non-operational AppError:", { message: err.message, stack: err.stack });
      }

      res.status(err.statusCode).json(createErrorResponse(err.errorCode, err.message, err.details));
      return;
    }

    // Handle body-parser JSON syntax errors
    if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
      res
        .status(400)
        .json(createErrorResponse(ErrorCode.BAD_REQUEST, "Invalid JSON payload in request body"));
      return;
    }

    const errorObj = err instanceof Error ? err : new Error(String(err));
    logger.error("Unhandled Internal Server Error:", {
      message: errorObj.message,
      stack: errorObj.stack,
    });

    const isProd = env.NODE_ENV === "production";
    res
      .status(500)
      .json(
        createErrorResponse(
          ErrorCode.INTERNAL_SERVER_ERROR,
          isProd ? "Internal server error" : errorObj.message || "Unknown error",
          undefined,
          !isProd ? errorObj.stack : undefined,
        ),
      );
  };
}
