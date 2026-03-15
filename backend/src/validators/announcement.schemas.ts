import { z } from "zod";

const colorRegex = /^#([0-9a-fA-F]{3}){1,2}$/;

export const createAnnouncementSchema = z.object({
  body: z.object({
    message: z.string().min(1),
    link_url: z.string().url().optional(),
    background_color: z.string().regex(colorRegex).optional(),
    text_color: z.string().regex(colorRegex).optional(),
    is_active: z.boolean().optional()
  })
});

export const updateAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    message: z.string().min(1).optional(),
    link_url: z.string().url().nullable().optional(),
    background_color: z.string().regex(colorRegex).optional(),
    text_color: z.string().regex(colorRegex).optional(),
    is_active: z.boolean().optional()
  })
});

export const toggleAnnouncementSchema = z.object({
  body: z.object({
    is_active: z.boolean()
  })
});
