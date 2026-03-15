"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserDeleteSchema = exports.adminUserRoleSchema = exports.adminUsersListSchema = void 0;
const zod_1 = require("zod");
exports.adminUsersListSchema = zod_1.z.object({
    query: zod_1.z.object({
        role: zod_1.z.enum(["admin", "staff", "customer"]).optional(),
        limit: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(1).max(100).optional()),
        offset: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(0).optional())
    })
});
exports.adminUserRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        role: zod_1.z.enum(["admin", "staff", "customer"])
    })
});
exports.adminUserDeleteSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
