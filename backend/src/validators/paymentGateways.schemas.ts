import { z } from "zod";

export const gatewayIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const toggleGatewaySchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    is_active: z.boolean()
  })
});

export const updateGatewaySchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    gateway_code: z.string().min(2).optional(),
    is_active: z.boolean().optional()
  })
});
