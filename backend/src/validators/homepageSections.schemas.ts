import { z } from "zod";

const sectionTypeSchema = z.enum([
  "hero",
  "featured_products",
  "categories",
  "promo_banners",
  "customer_reviews",
  "newsletter",
  "footer",
  "flash_sale"
]);

export const createHomepageSectionSchema = z.object({
  body: z.object({
    type: sectionTypeSchema,
    title: z.string().min(1).optional(),
    content: z.string().optional(),
    image: z.string().url().optional(),
    position: z.number().int().positive().optional(),
    is_active: z.boolean().optional()
  })
});

export const updateHomepageSectionSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    type: sectionTypeSchema.optional(),
    title: z.string().min(1).optional(),
    content: z.string().optional(),
    image: z.string().url().optional(),
    position: z.number().int().positive().optional(),
    is_active: z.boolean().optional()
  })
});

export const deleteHomepageSectionSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
