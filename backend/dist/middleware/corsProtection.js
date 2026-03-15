"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsProtection = void 0;
const cors_1 = __importDefault(require("cors"));
const corsConfig_1 = require("./corsConfig");
const origins = (0, corsConfig_1.getCorsOrigins)();
// Allow all origins when no CORS_ORIGIN is configured (local dev friendly).
// If origins are configured, enforce the allowlist.
exports.corsProtection = (0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (!origins.length)
            return callback(null, true);
        if (origins.includes(origin))
            return callback(null, true);
        return callback(new Error("CORS origin not allowed"));
    },
    credentials: true
});
