"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageSchema = void 0;
const zod_1 = require("zod");
exports.uploadImageSchema = zod_1.z.object({
    body: zod_1.z.object({
        folder: zod_1.z.enum(["products", "categories", "homepage"]).optional()
    })
});
