"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const AppError_1 = require("../utils/AppError");
// Middleware to validate request body/params/query using Zod schemas
const validateRequest = (schema) => (req, _res, next) => {
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
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
    });
    if (!result.success) {
        const message = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
        return next(new AppError_1.AppError(`Validation error: ${message}`, 400));
    }
    // Assign sanitized values back to the request
    const data = result.data;
    if (data.body) {
        req.body = data.body;
    }
    if (data.params) {
        applyValues(req.params, data.params);
    }
    if (data.query) {
        applyValues(req.query, data.query);
    }
    return next();
};
exports.validateRequest = validateRequest;
