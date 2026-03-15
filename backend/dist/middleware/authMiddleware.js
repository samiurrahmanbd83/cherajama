"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authenticate_1 = require("./authenticate");
// Base authentication middleware for all authenticated users
exports.authMiddleware = authenticate_1.authenticate;
