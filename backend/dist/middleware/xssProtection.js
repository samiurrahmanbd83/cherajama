"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xssProtection = void 0;
const xss_1 = __importDefault(require("xss"));
const sanitizeValue = (value) => {
    if (typeof value === "string") {
        return (0, xss_1.default)(value);
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value && typeof value === "object") {
        const sanitized = {};
        for (const [key, val] of Object.entries(value)) {
            sanitized[key] = sanitizeValue(val);
        }
        return sanitized;
    }
    return value;
};
// Sanitize input to mitigate XSS payloads
const xssProtection = (req, _res, next) => {
    const applyValues = (target, value) => {
        if (target && typeof target === "object") {
            for (const key of Object.keys(target)) {
                delete target[key];
            }
            if (value && typeof value === "object") {
                Object.assign(target, value);
            }
            return target;
        }
        return value;
    };
    req.body = sanitizeValue(req.body);
    applyValues(req.query, sanitizeValue(req.query));
    applyValues(req.params, sanitizeValue(req.params));
    next();
};
exports.xssProtection = xssProtection;
