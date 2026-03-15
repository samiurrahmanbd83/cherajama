import { z } from "zod";

export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    location: z.string().min(2).optional(),
    is_active: z.boolean().optional()
  })
});

export const updateMenuSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    location: z.string().min(2).nullable().optional(),
    is_active: z.boolean().optional()
  })
});

export const menuIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const menuSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(2)
  })
});

export const createMenuItemSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    label: z.string().min(1),
    url: z.string().min(1),
    parent_id: z.string().uuid().optional(),
    sort_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional()
  })
});

export const updateMenuItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid()
  }),
  body: z.object({
    label: z.string().min(1).optional(),
    url: z.string().min(1).optional(),
    parent_id: z.string().uuid().nullable().optional(),
    sort_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional()
  })
});

export const menuItemIdSchema = z.object({
  params: z.object({
    itemId: z.string().uuid()
  })
});

export const reorderMenuItemsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().uuid(),
        sort_order: z.number().int().min(0),
        parent_id: z.string().uuid().nullable().optional()
      })
    ).min(1)
  })
});
