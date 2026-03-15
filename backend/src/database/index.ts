import { db } from "./pool";
import { supabase } from "./supabase";
import { logger } from "../utils/logger";
import { env } from "../config/env";

// Ensure the database is reachable when the server boots
export const connectDatabase = async () => {
  if (env.DATABASE_URL) {
    try {
      await db.query("SELECT 1");
      logger.info("PostgreSQL connection established.");
      return;
    } catch (error) {
      logger.error("Failed to connect to PostgreSQL:", error);
      throw error;
    }
  }

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.info("Supabase client configured.");
    return;
  }

  logger.warn("No database configured. Set SUPABASE_URL or DATABASE_URL.");
};
