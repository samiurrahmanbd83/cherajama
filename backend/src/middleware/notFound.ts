import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

// 404 handler for unmatched routes
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};
