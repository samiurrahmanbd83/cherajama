import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

// Enforce role-based access control
export const requireRole = (roles: Array<"admin" | "staff" | "customer">) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied.", 403));
    }

    return next();
  };
};
