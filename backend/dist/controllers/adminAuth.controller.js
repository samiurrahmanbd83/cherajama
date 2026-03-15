"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const adminAuth_service_1 = require("../services/adminAuth.service");
// Admin login
const login = async (req, res) => {
    const result = await (0, adminAuth_service_1.loginAdmin)(req.body);
    res.status(200).json({ success: true, data: result });
};
exports.login = login;
