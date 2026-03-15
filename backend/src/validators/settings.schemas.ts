import { z } from "zod";

export const updateSettingsSchema = z.object({
  body: z.object({
    site_name: z.string().min(2).optional(),
    footer_text: z.string().optional(),
    contact_email: z.string().email().optional(),
    contact_phone: z.string().min(5).optional(),
    social_links: z.union([z.record(z.string(), z.string().url()), z.string().min(2)]).optional()
  })
});
