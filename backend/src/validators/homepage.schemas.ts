import { z } from "zod";

const sectionTypes = [
  "hero",
  "featured_products",
  "categories",
  "flash_sale",
  "promo_banners",
  "customer_reviews",
  "newsletter",
  "footer"
] as const;

export const createHomepageSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    is_active: z.boolean().optional()
  })
});

export const updateHomepageSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    is_active: z.boolean().optional()
  })
});

export const homepageIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const homepageSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(2)
  })
});

export const createSectionSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    type: z.enum(sectionTypes),
    title: z.string().min(1).optional(),
    subtitle: z.string().min(1).optional(),
    config: z.record(z.string(), z.any()).optional(),
    sort_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional()
  })
});

export const updateSectionSchema = z.object({
  params: z.object({
    sectionId: z.string().uuid()
  }),
  body: z.object({
    type: z.enum(sectionTypes).optional(),
    title: z.string().min(1).nullable().optional(),
    subtitle: z.string().min(1).nullable().optional(),
    config: z.record(z.string(), z.any()).optional(),
    sort_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional()
  })
});

export const sectionIdSchema = z.object({
  params: z.object({
    sectionId: z.string().uuid()
  })
});

export const reorderSectionsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().uuid(),
        sort_order: z.number().int().min(0)
      })
    ).min(1)
  })
});
