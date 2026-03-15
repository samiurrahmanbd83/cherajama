"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderMenuItems = exports.deleteMenuItem = exports.updateMenuItem = exports.addMenuItem = exports.deleteMenu = exports.updateMenu = exports.createMenu = exports.getMenuBySlug = exports.listMenus = void 0;
const pool_1 = require("../database/pool");
const AppError_1 = require("../utils/AppError");
const slugify_1 = require("../utils/slugify");
const buildMenuTree = (items) => {
    const byId = new Map();
    const roots = [];
    items.forEach((item) => {
        byId.set(item.id, { ...item, children: [] });
    });
    items.forEach((item) => {
        const node = byId.get(item.id);
        if (item.parent_id && byId.has(item.parent_id)) {
            byId.get(item.parent_id).children.push(node);
        }
        else {
            roots.push(node);
        }
    });
    return roots;
};
// List all menus (public/admin)
const listMenus = async () => {
    const result = await pool_1.db.query(`SELECT id, name, slug, location, is_active, created_at, updated_at
     FROM menus
     ORDER BY created_at DESC`);
    return result.rows;
};
exports.listMenus = listMenus;
// Get menu with nested items by slug (public)
const getMenuBySlug = async (slug) => {
    const menuResult = await pool_1.db.query(`SELECT id, name, slug, location, is_active, created_at, updated_at
     FROM menus WHERE slug = $1`, [slug]);
    const menu = menuResult.rows[0];
    if (!menu) {
        throw new AppError_1.AppError("Menu not found.", 404);
    }
    const itemsResult = await pool_1.db.query(`SELECT id, menu_id, parent_id, label, url, sort_order, is_active, created_at, updated_at
     FROM menu_items
     WHERE menu_id = $1
     ORDER BY sort_order ASC, created_at ASC`, [menu.id]);
    const items = buildMenuTree(itemsResult.rows);
    return { ...menu, items };
};
exports.getMenuBySlug = getMenuBySlug;
// Create a new menu (admin)
const createMenu = async (input) => {
    const slug = (0, slugify_1.slugify)(input.name);
    const existing = await pool_1.db.query(`SELECT id, name, slug, location, is_active, created_at, updated_at
     FROM menus WHERE slug = $1`, [slug]);
    if (existing.rows.length) {
        // Return existing menu instead of hard failing to keep admin UI idempotent.
        return existing.rows[0];
    }
    const result = await pool_1.db.query(`INSERT INTO menus (name, slug, location, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, slug, location, is_active, created_at, updated_at`, [input.name, slug, input.location ?? null, input.is_active ?? true]);
    return result.rows[0];
};
exports.createMenu = createMenu;
// Update menu (admin)
const updateMenu = async (menuId, input) => {
    const existing = await pool_1.db.query("SELECT id FROM menus WHERE id = $1", [menuId]);
    if (!existing.rows[0]) {
        throw new AppError_1.AppError("Menu not found.", 404);
    }
    const updates = [];
    const values = [];
    let index = 1;
    const setValue = (column, value) => {
        if (value === undefined)
            return;
        updates.push(`${column} = $${index++}`);
        values.push(value);
    };
    if (input.name) {
        const slug = (0, slugify_1.slugify)(input.name);
        const slugCheck = await pool_1.db.query("SELECT id FROM menus WHERE slug = $1 AND id <> $2", [slug, menuId]);
        if (slugCheck.rows.length) {
            throw new AppError_1.AppError("Menu slug already exists.", 409);
        }
        setValue("name", input.name);
        setValue("slug", slug);
    }
    setValue("location", input.location);
    setValue("is_active", input.is_active ?? undefined);
    if (!updates.length) {
        const result = await pool_1.db.query(`SELECT id, name, slug, location, is_active, created_at, updated_at
       FROM menus WHERE id = $1`, [menuId]);
        return result.rows[0];
    }
    updates.push("updated_at = NOW()");
    values.push(menuId);
    await pool_1.db.query(`UPDATE menus SET ${updates.join(", ")} WHERE id = $${index}`, values);
    const result = await pool_1.db.query(`SELECT id, name, slug, location, is_active, created_at, updated_at
     FROM menus WHERE id = $1`, [menuId]);
    return result.rows[0];
};
exports.updateMenu = updateMenu;
// Delete menu (admin)
const deleteMenu = async (menuId) => {
    const result = await pool_1.db.query("DELETE FROM menus WHERE id = $1 RETURNING id", [menuId]);
    if (!result.rows[0]) {
        throw new AppError_1.AppError("Menu not found.", 404);
    }
    return { id: result.rows[0].id };
};
exports.deleteMenu = deleteMenu;
// Add menu item (admin)
const addMenuItem = async (menuId, input) => {
    const menu = await pool_1.db.query("SELECT id FROM menus WHERE id = $1", [menuId]);
    if (!menu.rows[0]) {
        throw new AppError_1.AppError("Menu not found.", 404);
    }
    if (input.parent_id) {
        const parent = await pool_1.db.query("SELECT id FROM menu_items WHERE id = $1 AND menu_id = $2", [input.parent_id, menuId]);
        if (!parent.rows[0]) {
            throw new AppError_1.AppError("Parent menu item not found.", 404);
        }
    }
    let sortOrder = input.sort_order;
    if (sortOrder === undefined) {
        const maxOrder = await pool_1.db.query("SELECT COALESCE(MAX(sort_order), 0) AS max FROM menu_items WHERE menu_id = $1", [menuId]);
        sortOrder = Number(maxOrder.rows[0].max) + 1;
    }
    const result = await pool_1.db.query(`INSERT INTO menu_items (menu_id, parent_id, label, url, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, menu_id, parent_id, label, url, sort_order, is_active, created_at, updated_at`, [menuId, input.parent_id ?? null, input.label, input.url, sortOrder, input.is_active ?? true]);
    return result.rows[0];
};
exports.addMenuItem = addMenuItem;
// Update menu item (admin)
const updateMenuItem = async (itemId, input) => {
    const existing = await pool_1.db.query("SELECT id, menu_id FROM menu_items WHERE id = $1", [itemId]);
    const item = existing.rows[0];
    if (!item) {
        throw new AppError_1.AppError("Menu item not found.", 404);
    }
    if (input.parent_id === itemId) {
        throw new AppError_1.AppError("Menu item cannot be its own parent.", 400);
    }
    if (input.parent_id) {
        const parent = await pool_1.db.query("SELECT id FROM menu_items WHERE id = $1 AND menu_id = $2", [input.parent_id, item.menu_id]);
        if (!parent.rows[0]) {
            throw new AppError_1.AppError("Parent menu item not found.", 404);
        }
    }
    const updates = [];
    const values = [];
    let index = 1;
    const setValue = (column, value) => {
        if (value === undefined)
            return;
        updates.push(`${column} = $${index++}`);
        values.push(value);
    };
    setValue("label", input.label);
    setValue("url", input.url);
    setValue("parent_id", input.parent_id);
    setValue("sort_order", input.sort_order);
    setValue("is_active", input.is_active ?? undefined);
    if (!updates.length) {
        const result = await pool_1.db.query(`SELECT id, menu_id, parent_id, label, url, sort_order, is_active, created_at, updated_at
       FROM menu_items WHERE id = $1`, [itemId]);
        return result.rows[0];
    }
    updates.push("updated_at = NOW()");
    values.push(itemId);
    await pool_1.db.query(`UPDATE menu_items SET ${updates.join(", ")} WHERE id = $${index}`, values);
    const result = await pool_1.db.query(`SELECT id, menu_id, parent_id, label, url, sort_order, is_active, created_at, updated_at
     FROM menu_items WHERE id = $1`, [itemId]);
    return result.rows[0];
};
exports.updateMenuItem = updateMenuItem;
// Delete menu item (admin)
const deleteMenuItem = async (itemId) => {
    const result = await pool_1.db.query("DELETE FROM menu_items WHERE id = $1 RETURNING id", [itemId]);
    if (!result.rows[0]) {
        throw new AppError_1.AppError("Menu item not found.", 404);
    }
    return { id: result.rows[0].id };
};
exports.deleteMenuItem = deleteMenuItem;
// Reorder menu items (drag & drop)
const reorderMenuItems = async (menuId, items) => {
    if (items.some((item) => item.parent_id === item.id)) {
        throw new AppError_1.AppError("Menu item cannot be its own parent.", 400);
    }
    const ids = items.map((item) => item.id);
    const existing = await pool_1.db.query("SELECT id FROM menu_items WHERE menu_id = $1 AND id = ANY($2::uuid[])", [menuId, ids]);
    if (existing.rows.length !== items.length) {
        throw new AppError_1.AppError("One or more menu items are invalid.", 400);
    }
    const parentIds = items
        .map((item) => item.parent_id)
        .filter((parentId) => Boolean(parentId));
    if (parentIds.length) {
        const parents = await pool_1.db.query("SELECT id FROM menu_items WHERE menu_id = $1 AND id = ANY($2::uuid[])", [menuId, parentIds]);
        if (parents.rows.length !== new Set(parentIds).size) {
            throw new AppError_1.AppError("One or more parent menu items are invalid.", 400);
        }
    }
    const pool = (0, pool_1.getPool)();
    await pool.query("BEGIN");
    try {
        for (const item of items) {
            await pool_1.db.query(`UPDATE menu_items
         SET sort_order = $1, parent_id = $2, updated_at = NOW()
         WHERE id = $3`, [item.sort_order, item.parent_id ?? null, item.id]);
        }
        await pool.query("COMMIT");
    }
    catch (error) {
        await pool.query("ROLLBACK");
        throw error;
    }
    return { updated: items.length };
};
exports.reorderMenuItems = reorderMenuItems;
