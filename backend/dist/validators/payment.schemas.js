"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeStatusSchema = exports.paymentDisputeSchema = exports.paymentRiskReportQuerySchema = exports.paymentAnalyticsQuerySchema = exports.paymentLogsQuerySchema = exports.paymentsQuerySchema = exports.paymentOrderIdSchema = exports.submitPaymentSchema = exports.paymentMethodSchema = void 0;
const zod_1 = require("zod");
exports.paymentMethodSchema = zod_1.z.enum([
    "bkash",
    "nagad",
    "rocket",
    "upay",
    "cash_on_delivery"
]);
exports.submitPaymentSchema = zod_1.z
    .object({
    body: zod_1.z.object({
        order_id: zod_1.z.string().uuid(),
        payment_method: exports.paymentMethodSchema,
        sender_phone: zod_1.z.string().min(6).optional(),
        transaction_id: zod_1.z.string().min(6).optional(),
        paid_amount: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().positive())
    })
})
    .superRefine((value, ctx) => {
    const method = value.body.payment_method;
    if (method !== "cash_on_delivery") {
        if (!value.body.sender_phone) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Sender phone number is required for mobile payments.",
                path: ["body", "sender_phone"]
            });
        }
        if (!value.body.transaction_id) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Transaction ID is required for mobile payments.",
                path: ["body", "transaction_id"]
            });
        }
    }
});
exports.paymentOrderIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        order_id: zod_1.z.string().uuid()
    })
});
exports.paymentsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.string().optional(),
        risk: zod_1.z.enum(["low", "medium", "high"]).optional()
    })
});
exports.paymentLogsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        order_id: zod_1.z.string().uuid().optional()
    })
});
exports.paymentAnalyticsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        days: zod_1.z.preprocess((value) => (value === undefined || value === "" ? undefined : Number(value)), zod_1.z.number().int().min(1).max(365).optional())
    })
});
exports.paymentRiskReportQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        level: zod_1.z.enum(["low", "medium", "high"]).optional()
    })
});
exports.paymentDisputeSchema = zod_1.z.object({
    body: zod_1.z.object({
        order_id: zod_1.z.string().uuid(),
        payment_method: exports.paymentMethodSchema,
        transaction_id: zod_1.z.string().min(6),
        description: zod_1.z.string().min(10),
        screenshot_url: zod_1.z.string().url().optional()
    })
});
exports.disputeStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["open", "under_review", "resolved", "rejected"])
    })
});
