"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
// Business logic for health checks
const getHealthStatus = () => {
    return {
        status: "ok",
        timestamp: new Date().toISOString()
    };
};
exports.getHealthStatus = getHealthStatus;
