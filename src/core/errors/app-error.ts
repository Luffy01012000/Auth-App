import { ErrorCode, type ErrorCodeType } from "./error-codes.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCodeType;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    errorCode: ErrorCodeType = ErrorCode.INTERNAL_SERVER_ERROR,
    details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, ErrorCode.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, 401, ErrorCode.UNAUTHORIZED, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(message, 403, ErrorCode.FORBIDDEN, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super(message, 404, ErrorCode.NOT_FOUND, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict", details?: unknown) {
    super(message, 409, ErrorCode.CONFLICT, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, ErrorCode.VALIDATION_ERROR, details);
  }
}
