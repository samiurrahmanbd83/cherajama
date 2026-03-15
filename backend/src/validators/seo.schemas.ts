import { z } from "zod";

const entityTypes = ["site", "homepage", "category", "product"] as const;

export const seoEntitySchema = z.object({
  params: z.object({
    entity_type: z.enum(entityTypes),
    entity_id: z.string().uuid()
  })
});

export const seoSiteSchema = z.object({
  params: z.object({})
});

export const upsertSeoSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    meta_description: z.string().min(1).optional(),
    meta_keywords: z.array(z.string().min(1)).optional(),
    og_title: z.string().min(1).optional(),
    og_description: z.string().min(1).optional(),
    og_image: z.string().url().optional(),
    og_type: z.string().min(1).optional(),
    canonical_url: z.string().url().optional(),
    noindex: z.boolean().optional(),
    nofollow: z.boolean().optional()
  })
});

export const seoSiteUpsertSchema = z.object({
  body: upsertSeoSchema.shape.body
});

export const upsertSeoEntitySchema = z.object({
  params: seoEntitySchema.shape.params,
  body: upsertSeoSchema.shape.body
});
