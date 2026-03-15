"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderMenuItemsSchema = exports.menuItemIdSchema = exports.updateMenuItemSchema = exports.createMenuItemSchema = exports.menuSlugSchema = exports.menuIdSchema = exports.updateMenuSchema = exports.createMenuSchema = void 0;
const zod_1 = require("zod");
exports.createMenuSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        location: zod_1.z.string().min(2).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.updateMenuSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        location: zod_1.z.string().min(2).nullable().optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.menuIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    })
});
exports.menuSlugSchema = zod_1.z.object({
    params: zod_1.z.object({
        slug: zod_1.z.string().min(2)
    })
});
exports.createMenuItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        label: zod_1.z.string().min(1),
        url: zod_1.z.string().min(1),
        parent_id: zod_1.z.string().uuid().optional(),
        sort_order: zod_1.z.number().int().min(0).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.updateMenuItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        itemId: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        label: zod_1.z.string().min(1).optional(),
        url: zod_1.z.string().min(1).optional(),
        parent_id: zod_1.z.string().uuid().nullable().optional(),
        sort_order: zod_1.z.number().int().min(0).optional(),
        is_active: zod_1.z.boolean().optional()
    })
});
exports.menuItemIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        itemId: zod_1.z.string().uuid()
    })
});
exports.reorderMenuItemsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid()
    }),
    body: zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string().uuid(),
            sort_order: zod_1.z.number().int().min(0),
            parent_id: zod_1.z.string().uuid().nullable().optional()
        })).min(1)
    })
});
