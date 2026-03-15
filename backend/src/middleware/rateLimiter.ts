import rateLimit from "express-rate-limit";
import type { RequestHandler } from "express";
import { env } from "../config/env";

// Basic rate limiting to mitigate abuse
const maxRequests = env.NODE_ENV === "development" ? Math.max(env.RATE_LIMIT_MAX, 1000) : env.RATE_LIMIT_MAX;

export const rateLimiter: RequestHandler =
  env.NODE_ENV === "development"
    ? (_req, _res, next) => next()
    : rateLimit({
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        max: maxRequests,
        // Allow CORS preflight to pass without throttling.
        skip: (req) => req.method === "OPTIONS",
        standardHeaders: true,
        legacyHeaders: false,
        message: {
          success: false,
          message: "Too many requests. Please try again later."
        }
      });
