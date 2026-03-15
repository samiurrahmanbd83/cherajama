import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

// Admin-only authentication middleware
export const adminAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Authorization token missing.", 401));
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);

    if (payload.role !== "admin") {
      return next(new AppError("Unauthorized.", 401));
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch (error) {
    return next(new AppError("Invalid or expired token.", 401));
  }
};
