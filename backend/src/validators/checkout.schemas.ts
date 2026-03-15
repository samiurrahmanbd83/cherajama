import { z } from "zod";

export const checkoutSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email(),
    shipping_address: z.string().min(5),
    city: z.string().min(2),
    postal_code: z.string().min(3)
  })
});
