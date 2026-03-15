import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    parent_id: z.string().uuid().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    imageUrl: z.string().url().optional()
  })
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    parent_id: z.string().uuid().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    imageUrl: z.string().url().optional()
  })
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
