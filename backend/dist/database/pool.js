"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.getPool = exports.db = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
const logger_1 = require("../utils/logger");
// Shared connection pool for the application (optional)
const config = (0, config_1.getDatabaseConfig)();
const pool = config ? new pg_1.Pool(config) : null;
if (pool) {
    pool.on("error", (error) => {
        // A pool-level error indicates a broken or invalid client
        logger_1.logger.error("Unexpected PostgreSQL pool error:", error);
    });
}
exports.db = {
    query: (text, params) => {
        if (!pool) {
            throw new Error("DATABASE_URL is not configured. Postgres queries are unavailable.");
        }
        return pool.query(text, params);
    },
    pool
};
const getPool = () => {
    if (!pool) {
        throw new Error("DATABASE_URL is not configured. Postgres queries are unavailable.");
    }
    return pool;
};
exports.getPool = getPool;
const closePool = async () => {
    if (pool) {
        await pool.end();
    }
};
exports.closePool = closePool;
