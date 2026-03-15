import { z } from "zod";

export const adminUsersListSchema = z.object({
  query: z.object({
    role: z.enum(["admin", "staff", "customer"]).optional(),
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

export const adminUserRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    role: z.enum(["admin", "staff", "customer"])
  })
});

export const adminUserDeleteSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
