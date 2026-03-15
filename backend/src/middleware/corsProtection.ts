import cors from "cors";
import { getCorsOrigins } from "./corsConfig";

const origins = getCorsOrigins();

// Allow all origins when no CORS_ORIGIN is configured (local dev friendly).
// If origins are configured, enforce the allowlist.
export const corsProtection = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!origins.length) return callback(null, true);
    if (origins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true
});
