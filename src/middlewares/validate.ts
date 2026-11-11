import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { ValidationError } from "../core/errors/app-error.js";

export interface RequestValidators {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export function validate(schemas: RequestValidators) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as Request["params"];
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as Request["query"];
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        next(new ValidationError("Request validation failed", issues));
      } else {
        next(error);
      }
    }
  };
}
