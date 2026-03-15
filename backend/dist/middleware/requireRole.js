"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const AppError_1 = require("../utils/AppError");
// Enforce role-based access control
const requireRole = (roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError_1.AppError("Not authenticated.", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError("Access denied.", 403));
        }
        return next();
    };
};
exports.requireRole = requireRole;
