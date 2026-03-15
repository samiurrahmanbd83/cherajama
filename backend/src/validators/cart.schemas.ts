import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    product_id: z.string().uuid(),
    quantity: z.coerce.number().int().positive().default(1)
  })
});

export const updateCartItemSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    quantity: z.coerce.number().int().positive()
  })
});

export const removeCartItemSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
