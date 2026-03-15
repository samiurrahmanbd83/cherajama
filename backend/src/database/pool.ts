import { Pool, QueryResultRow } from "pg";
import { getDatabaseConfig } from "./config";
import { logger } from "../utils/logger";

// Shared connection pool for the application (optional)
const config = getDatabaseConfig();
const pool = config ? new Pool(config) : null;

if (pool) {
  pool.on("error", (error) => {
    // A pool-level error indicates a broken or invalid client
    logger.error("Unexpected PostgreSQL pool error:", error);
  });
}

export const db = {
  query: <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => {
    if (!pool) {
      throw new Error("DATABASE_URL is not configured. Postgres queries are unavailable.");
    }
    return pool.query<T>(text, params);
  },
  pool
};

export const getPool = () => {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured. Postgres queries are unavailable.");
  }
  return pool;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
  }
};
