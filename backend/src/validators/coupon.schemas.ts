import { z } from "zod";

export const couponIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3),
    discount_type: z.enum(["percentage", "fixed"]),
    discount_value: z.coerce.number().positive(),
    minimum_order: z.coerce.number().nonnegative().optional(),
    expiry_date: z.string().datetime().optional()
  })
});

export const updateCouponSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    code: z.string().min(3).optional(),
    discount_type: z.enum(["percentage", "fixed"]).optional(),
    discount_value: z.coerce.number().positive().optional(),
    minimum_order: z.coerce.number().nonnegative().optional(),
    expiry_date: z.string().datetime().optional()
  })
});
