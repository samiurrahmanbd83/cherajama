"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topProductsSchema = exports.revenueSeriesSchema = exports.salesSeriesSchema = void 0;
const zod_1 = require("zod");
exports.salesSeriesSchema = zod_1.z.object({
    query: zod_1.z.object({
        days: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(1).max(365).optional())
    })
});
exports.revenueSeriesSchema = zod_1.z.object({
    query: zod_1.z.object({
        months: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(1).max(36).optional())
    })
});
exports.topProductsSchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(1).max(50).optional())
    })
});
