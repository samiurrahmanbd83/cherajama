import type { NextFunction, Request, Response } from "express";
import type { ZodIssue, ZodTypeAny } from "zod";
import { AppError } from "../utils/AppError";

// Middleware to validate request body/params/query using Zod schemas
export const validateRequest = (schema: ZodTypeAny) => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const applyValues = <T extends Record<string, any>>(target: T, value: T) => {
    if (target && typeof target === "object") {
      for (const key of Object.keys(target)) {
        delete target[key];
      }
      if (value && typeof value === "object") {
        Object.assign(target, value);
      }
      return target;
    }
    return value;
  };

  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    const message = result.error.issues
      .map((issue: ZodIssue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    return next(new AppError(`Validation error: ${message}`, 400));
  }

  // Assign sanitized values back to the request
  const data = result.data as {
    body?: Record<string, any>;
    params?: Record<string, any>;
    query?: Record<string, any>;
  };
  if (data.body) {
    req.body = data.body;
  }
  if (data.params) {
    applyValues(req.params as Record<string, any>, data.params);
  }
  if (data.query) {
    applyValues(req.query as Record<string, any>, data.query);
  }

  return next();
};
