import { z } from "zod";

export const reviewAdminListSchema = z.object({
  query: z.object({
    status: z.enum(["approved", "pending"]).optional(),
    limit: z.preprocess(
      (value) => (value === undefined || value === "" ? undefined : Number(value)),
      z.number().int().min(1).max(100).optional()
    ),
    offset: z.preprocess(
      (value) => (value === undefined || value === "" ? undefined : Number(value)),
      z.number().int().min(0).optional()
    )
  })
});

export const reviewAdminUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    is_approved: z.boolean()
  })
});
