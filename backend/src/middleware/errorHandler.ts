import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

// Global error handler to ensure consistent error responses
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  if (!isAppError) {
    logger.error("Unhandled error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};
