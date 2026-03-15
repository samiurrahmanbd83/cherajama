"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const health_service_1 = require("../services/health.service");
// Controller to return API health status
const healthCheck = (_req, res) => {
    const data = (0, health_service_1.getHealthStatus)();
    res.status(200).json({ success: true, data });
};
exports.healthCheck = healthCheck;
