import { z } from "zod";

export const salesSeriesSchema = z.object({
  query: z.object({
    days: z.preprocess(
      (value) => (value === undefined || value === "" ? undefined : Number(value)),
      z.number().int().min(1).max(365).optional()
    )
  })
});

export const revenueSeriesSchema = z.object({
  query: z.object({
    months: z.preprocess(
      (value) => (value === undefined || value === "" ? undefined : Number(value)),
      z.number().int().min(1).max(36).optional()
    )
  })
});

export const topProductsSchema = z.object({
  query: z.object({
    limit: z.preprocess(
      (value) => (value === undefined || value === "" ? undefined : Number(value)),
      z.number().int().min(1).max(50).optional()
    )
  })
});
