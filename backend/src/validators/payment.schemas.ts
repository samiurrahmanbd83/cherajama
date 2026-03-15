import { z } from "zod";

export const paymentMethodSchema = z.enum([
  "bkash",
  "nagad",
  "rocket",
  "upay",
  "cash_on_delivery"
]);

export const submitPaymentSchema = z
  .object({
    body: z.object({
      order_id: z.string().uuid(),
      payment_method: paymentMethodSchema,
      sender_phone: z.string().min(6).optional(),
      transaction_id: z.string().min(6).optional(),
      paid_amount: z.preprocess(
        (value) => (value === undefined || value === "" ? undefined : Number(value)),
        z.number().positive()
      )
    })
  })
  .superRefine((value, ctx) => {
    const method = value.body.payment_method;
    if (method !== "cash_on_delivery") {
      if (!value.body.sender_phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender phone number is required for mobile payments.",
          path: ["body", "sender_phone"]
        });
      }
      if (!value.body.transaction_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Transaction ID is required for mobile payments.",
          path: ["body", "transaction_id"]
        });
      }
    }
  });

export const paymentOrderIdSchema = z.object({
  params: z.object({
    order_id: z.string().uuid()
  })
});

export const paymentsQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
    risk: z.enum(["low", "medium", "high"]).optional()
  })
});

export const paymentLogsQuerySchema = z.object({
  query: z.object({
    order_id: z.string().uuid().optional()
  })
});

export const paymentAnalyticsQuerySchema = z.object({
  query: z.object({
    days: z.preprocess(
      (value) => (value === undefined || value === "" ? undefined : Number(value)),
      z.number().int().min(1).max(365).optional()
    )
  })
});

export const paymentRiskReportQuerySchema = z.object({
  query: z.object({
    level: z.enum(["low", "medium", "high"]).optional()
  })
});

export const paymentDisputeSchema = z.object({
  body: z.object({
    order_id: z.string().uuid(),
    payment_method: paymentMethodSchema,
    transaction_id: z.string().min(6),
    description: z.string().min(10),
    screenshot_url: z.string().url().optional()
  })
});

export const disputeStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    status: z.enum(["open", "under_review", "resolved", "rejected"])
  })
});
