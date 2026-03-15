"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileHandler = exports.profile = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
// Register a new user
const register = async (req, res) => {
    const { user, token } = await (0, auth_service_1.registerUser)(req.body);
    res.status(201).json({ success: true, data: { user, token } });
};
exports.register = register;
// Authenticate and issue a JWT
const login = async (req, res) => {
    const { user, token } = await (0, auth_service_1.loginUser)(req.body);
    res.status(200).json({ success: true, data: { user, token } });
};
exports.login = login;
// Return current user's profile
const profile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated." });
    }
    const user = await (0, auth_service_1.getProfile)(req.user.id);
    return res.status(200).json({ success: true, data: { user } });
};
exports.profile = profile;
// Update current user's profile
const updateProfileHandler = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated." });
    }
    const user = await (0, auth_service_1.updateProfile)(req.user.id, req.body);
    return res.status(200).json({ success: true, data: { user } });
};
exports.updateProfileHandler = updateProfileHandler;
