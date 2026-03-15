import { z } from "zod";

export const updateChatButtonsSchema = z.object({
  body: z.object({
    whatsapp_number: z.string().min(5).optional(),
    whatsapp_message: z.string().min(1).optional(),
    messenger_username: z.string().min(2).optional(),
    is_enabled: z.boolean().optional()
  })
});
