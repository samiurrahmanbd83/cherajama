"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
// Global error handler to ensure consistent error responses
const errorHandler = (err, _req, res, _next) => {
    const isAppError = err instanceof AppError_1.AppError;
    const statusCode = isAppError ? err.statusCode : 500;
    if (!isAppError) {
        logger_1.logger.error("Unhandled error:", err);
    }
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};
exports.errorHandler = errorHandler;
