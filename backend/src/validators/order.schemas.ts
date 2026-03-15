import { z } from "zod";

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const createOrderSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email(),
    shipping_address: z.string().min(5),
    city: z.string().min(2),
    postal_code: z.string().min(3)
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"])
  })
});
