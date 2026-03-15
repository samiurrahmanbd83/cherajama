"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffMiddleware = void 0;
const authenticate_1 = require("./authenticate");
const requireRole_1 = require("./requireRole");
// Restrict access to staff and admin users
exports.staffMiddleware = [authenticate_1.authenticate, (0, requireRole_1.requireRole)(["admin", "staff"])];
