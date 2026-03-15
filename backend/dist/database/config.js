"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const env_1 = require("../config/env");
// Resolve database configuration at runtime (optional)
const getDatabaseConfig = () => {
    if (!env_1.env.DATABASE_URL) {
        return null;
    }
    return {
        connectionString: env_1.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
