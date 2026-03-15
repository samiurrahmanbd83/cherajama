"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const pool_1 = require("./pool");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
// Ensure the database is reachable when the server boots
const connectDatabase = async () => {
    if (env_1.env.DATABASE_URL) {
        try {
            await pool_1.db.query("SELECT 1");
            logger_1.logger.info("PostgreSQL connection established.");
            return;
        }
        catch (error) {
            logger_1.logger.error("Failed to connect to PostgreSQL:", error);
            throw error;
        }
    }
    if (env_1.env.SUPABASE_URL && env_1.env.SUPABASE_SERVICE_ROLE_KEY) {
        logger_1.logger.info("Supabase client configured.");
        return;
    }
    logger_1.logger.warn("No database configured. Set SUPABASE_URL or DATABASE_URL.");
};
exports.connectDatabase = connectDatabase;
