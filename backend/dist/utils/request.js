"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = void 0;
const AppError_1 = require("./AppError");
const getParam = (params, key) => {
    const value = params[key];
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }
    if (typeof value === "string") {
        return value;
    }
    throw new AppError_1.AppError(`Missing route param: ${key}`, 400);
};
exports.getParam = getParam;
