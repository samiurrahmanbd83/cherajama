"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
// Basic rate limiting to mitigate abuse
const maxRequests = env_1.env.NODE_ENV === "development" ? Math.max(env_1.env.RATE_LIMIT_MAX, 1000) : env_1.env.RATE_LIMIT_MAX;
exports.rateLimiter = env_1.env.NODE_ENV === "development"
    ? (_req, _res, next) => next()
    : (0, express_rate_limit_1.default)({
        windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
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
