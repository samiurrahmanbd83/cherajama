"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const AppError_1 = require("../utils/AppError");
const auth_service_1 = require("./auth.service");
const loginAdmin = async (input) => {
    const result = await (0, auth_service_1.loginUser)(input);
    if (result.user.role !== "admin") {
        throw new AppError_1.AppError("Invalid credentials.", 401);
    }
    return {
        admin: {
            id: result.user.id,
            email: result.user.email,
            role: "admin"
        },
        token: result.token
    };
};
exports.loginAdmin = loginAdmin;
