import { z } from "zod";

export const uploadImageSchema = z.object({
  body: z.object({
    folder: z.enum(["products", "categories", "homepage"]).optional()
  })
});
