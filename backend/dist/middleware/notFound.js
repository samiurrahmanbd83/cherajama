"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const AppError_1 = require("../utils/AppError");
// 404 handler for unmatched routes
const notFound = (req, _res, next) => {
    next(new AppError_1.AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};
exports.notFound = notFound;
