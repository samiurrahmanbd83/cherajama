"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.updateRole = exports.list = void 0;
const adminUsers_service_1 = require("../services/adminUsers.service");
const request_1 = require("../utils/request");
const list = async (req, res) => {
    const users = await (0, adminUsers_service_1.listUsers)(req.query);
    res.status(200).json({ success: true, data: { users } });
};
exports.list = list;
const updateRole = async (req, res) => {
    const user = await (0, adminUsers_service_1.updateUserRole)((0, request_1.getParam)(req.params, "id"), req.body.role);
    res.status(200).json({ success: true, data: { user } });
};
exports.updateRole = updateRole;
const remove = async (req, res) => {
    const result = await (0, adminUsers_service_1.deleteUser)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: result });
};
exports.remove = remove;
