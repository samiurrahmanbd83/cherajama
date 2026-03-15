import { env } from "../config/env";

// Parse CORS origins (supports comma-separated list)
export const getCorsOrigins = () => {
  const raw = env.CORS_ORIGIN || "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};
