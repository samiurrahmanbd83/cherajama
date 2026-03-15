"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOrigins = void 0;
const env_1 = require("../config/env");
// Parse CORS origins (supports comma-separated list)
const getCorsOrigins = () => {
    const raw = env_1.env.CORS_ORIGIN || "";
    return raw
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
};
exports.getCorsOrigins = getCorsOrigins;
