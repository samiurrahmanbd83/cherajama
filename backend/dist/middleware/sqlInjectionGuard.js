"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlInjectionGuard = void 0;
const AppError_1 = require("../utils/AppError");
const suspiciousPattern = /('|"|;|--|\/\*|\*\/|\b(select|insert|update|delete|drop|alter|create|truncate|union|sleep|benchmark)\b)/i;
const collectStrings = (value, acc = []) => {
    if (typeof value === "string") {
        acc.push(value);
    }
    else if (Array.isArray(value)) {
        value.forEach((item) => collectStrings(item, acc));
    }
    else if (value && typeof value === "object") {
        Object.values(value).forEach((item) => collectStrings(item, acc));
    }
    return acc;
};
// Lightweight guard to block obvious SQL injection attempts
const sqlInjectionGuard = (req, _res, next) => {
    const values = [
        ...collectStrings(req.body),
        ...collectStrings(req.query),
        ...collectStrings(req.params)
    ];
    const hit = values.find((value) => suspiciousPattern.test(value));
    if (hit) {
        return next(new AppError_1.AppError("Potentially malicious input detected.", 400));
    }
    return next();
};
exports.sqlInjectionGuard = sqlInjectionGuard;
