"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
// Verify JWT and attach user context to the request
const authenticate = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return next(new AppError_1.AppError("Authorization token missing.", 401));
    }
    const token = header.replace("Bearer ", "").trim();
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        };
        return next();
    }
    catch (error) {
        return next(new AppError_1.AppError("Invalid or expired token.", 401));
    }
};
exports.authenticate = authenticate;
