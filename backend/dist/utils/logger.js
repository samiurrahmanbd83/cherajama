"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const env_1 = require("../config/env");
// Minimal log-level filtering using console under the hood
const levels = ["error", "warn", "info", "debug"];
const getLevelIndex = (level) => levels.indexOf(level);
const configuredLevel = env_1.env.LOG_LEVEL ?? "info";
const configuredIndex = getLevelIndex(configuredLevel);
const shouldLog = (level) => getLevelIndex(level) <= configuredIndex;
exports.logger = {
    error: (...args) => {
        if (shouldLog("error"))
            console.error(...args);
    },
    warn: (...args) => {
        if (shouldLog("warn"))
            console.warn(...args);
    },
    info: (...args) => {
        if (shouldLog("info"))
            console.log(...args);
    },
    debug: (...args) => {
        if (shouldLog("debug"))
            console.debug(...args);
    }
};
