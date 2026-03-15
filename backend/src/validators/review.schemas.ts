import { z } from "zod";

export const reviewProductIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const createReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(3)
  })
});
