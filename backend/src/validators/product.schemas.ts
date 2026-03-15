import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    image: z.string().url().optional(),
    category_id: z.string().uuid().optional(),
    stock: z.coerce.number().int().min(0).optional()
  })
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    image: z.string().url().optional(),
    category_id: z.string().uuid().optional(),
    stock: z.coerce.number().int().min(0).optional()
  })
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const productSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(2)
  })
});

export const productSearchSchema = z.object({
  query: z.object({
    keyword: z.string().min(2).optional(),
    category_id: z.string().uuid().optional(),
    min_price: z.coerce.number().nonnegative().optional(),
    max_price: z.coerce.number().nonnegative().optional(),
    tag: z.string().min(1).optional(),
    sort: z.enum(["price_low_high", "price_high_low", "newest"]).optional()
  })
});
