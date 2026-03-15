import { z } from "zod";

const providers = ["meta_pixel", "facebook_capi", "tiktok_pixel"] as const;

export const marketingProviderSchema = z.object({
  params: z.object({
    provider: z.enum(providers)
  })
});

export const updateMarketingSchema = z.object({
  params: z.object({
    provider: z.enum(providers)
  }),
  body: z.object({
    tracking_id: z.string().min(1).optional(),
    is_enabled: z.boolean().optional(),
    config: z.record(z.string(), z.any()).optional()
  })
});
