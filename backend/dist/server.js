"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./database");
const logger_1 = require("./utils/logger");
// Initialize dependencies then start HTTP server
const startServer = async () => {
    await (0, database_1.connectDatabase)();
    const server = app_1.default.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`API listening on port ${env_1.env.PORT}`);
    });
    // Graceful shutdown for unhandled errors
    process.on("unhandledRejection", (reason) => {
        logger_1.logger.error("Unhandled rejection:", reason);
        server.close(() => process.exit(1));
    });
    process.on("uncaughtException", (error) => {
        logger_1.logger.error("Uncaught exception:", error);
        server.close(() => process.exit(1));
    });
};
startServer().catch((error) => {
    logger_1.logger.error("Failed to start server:", error);
    process.exit(1);
});
