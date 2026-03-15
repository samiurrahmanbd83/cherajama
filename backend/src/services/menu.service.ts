import { db, getPool } from "../database/pool";
import { AppError } from "../utils/AppError";
import { slugify } from "../utils/slugify";

const buildMenuTree = (items: Array<any>) => {
  const byId = new Map<string, any>();
  const roots: any[] = [];

  items.forEach((item) => {
    byId.set(item.id, { ...item, children: [] });
  });

  items.forEach((item) => {
    const node = byId.get(item.id);
    if (item.parent_id && byId.has(item.parent_id)) {
      byId.get(item.parent_id).children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

// List all menus (public/admin)
export const listMenus = async () => {
  const result = await db.query(
    `SELECT id, name, slug, location, is_active, created_at, updated_at
     FROM menus
     ORDER BY created_at DESC`
  );
  return result.rows;
};

// Get menu with nested items by slug (public)
export const getMenuBySlug = async (slug: string) => {
  const menuResult = await db.query(
    `SELECT id, name, slug, location, is_active, created_at, updated_at
     FROM menus WHERE slug = $1`,
    [slug]
  );

  const menu = menuResult.rows[0];
  if (!menu) {
    throw new AppError("Menu not found.", 404);
  }

  const itemsResult = await db.query(
    `SELECT id, menu_id, parent_id, label, url, sort_order, is_active, created_at, updated_at
     FROM menu_items
     WHERE menu_id = $1
     ORDER BY sort_order ASC, created_at ASC`,
    [menu.id]
  );

  const items = buildMenuTree(itemsResult.rows);
  return { ...menu, items };
};

// Create a new menu (admin)
export const createMenu = async (input: {
  name: string;
  location?: string;
  is_active?: boolean;
}) => {
  const slug = slugify(input.name);

  const existing = await db.query(
    `SELECT id, name, slug, location, is_active, created_at, updated_at
     FROM menus WHERE slug = $1`,
    [slug]
  );
  if (existing.rows.length) {
    // Return existing menu instead of hard failing to keep admin UI idempotent.
    return existing.rows[0];
  }

  const result = await db.query(
    `INSERT INTO menus (name, slug, location, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, slug, location, is_active, created_at, updated_at`,
    [input.name, slug, input.location ?? null, input.is_active ?? true]
  );

  return result.rows[0];
};

// Update menu (admin)
export const updateMenu = async (
  menuId: string,
  input: { name?: string; location?: string | null; is_active?: boolean }
) => {
  const existing = await db.query("SELECT id FROM menus WHERE id = $1", [menuId]);
  if (!existing.rows[0]) {
    throw new AppError("Menu not found.", 404);
  }

  const updates: string[] = [];
  const values: Array<string | boolean | null> = [];
  let index = 1;

  const setValue = (column: string, value: string | boolean | null | undefined) => {
    if (value === undefined) return;
    updates.push(`${column} = $${index++}`);
    values.push(value);
  };

  if (input.name) {
    const slug = slugify(input.name);
    const slugCheck = await db.query(
      "SELECT id FROM menus WHERE slug = $1 AND id <> $2",
      [slug, menuId]
    );
    if (slugCheck.rows.length) {
      throw new AppError("Menu slug already exists.", 409);
    }
    setValue("name", input.name);
    setValue("slug", slug);
  }

  setValue("location", input.location);
  setValue("is_active", input.is_active ?? undefined);

  if (!updates.length) {
    const result = await db.query(
      `SELECT id, name, slug, location, is_active, created_at, updated_at
       FROM menus WHERE id = $1`,
      [menuId]
    );
    return result.rows[0];
  }

  updates.push("updated_at = NOW()");
  values.push(menuId);

  await db.query(`UPDATE menus SET ${updates.join(", ")} WHERE id = $${index}`, values);

  const result = await db.query(
    `SELECT id, name, slug, location, is_active, created_at, updated_at
     FROM menus WHERE id = $1`,
    [menuId]
  );

  return result.rows[0];
};

// Delete menu (admin)
export const deleteMenu = async (menuId: string) => {
  const result = await db.query("DELETE FROM menus WHERE id = $1 RETURNING id", [menuId]);
  if (!result.rows[0]) {
    throw new AppError("Menu not found.", 404);
  }

  return { id: result.rows[0].id };
};

// Add menu item (admin)
export const addMenuItem = async (menuId: string, input: {
  label: string;
  url: string;
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;
}) => {
  const menu = await db.query("SELECT id FROM menus WHERE id = $1", [menuId]);
  if (!menu.rows[0]) {
    throw new AppError("Menu not found.", 404);
  }

  if (input.parent_id) {
    const parent = await db.query(
      "SELECT id FROM menu_items WHERE id = $1 AND menu_id = $2",
      [input.parent_id, menuId]
    );
    if (!parent.rows[0]) {
      throw new AppError("Parent menu item not found.", 404);
    }
  }

  let sortOrder = input.sort_order;
  if (sortOrder === undefined) {
    const maxOrder = await db.query<{ max: number }>(
      "SELECT COALESCE(MAX(sort_order), 0) AS max FROM menu_items WHERE menu_id = $1",
      [menuId]
    );
    sortOrder = Number(maxOrder.rows[0].max) + 1;
  }

  const result = await db.query(
    `INSERT INTO menu_items (menu_id, parent_id, label, url, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, menu_id, parent_id, label, url, sort_order, is_active, created_at, updated_at`,
    [menuId, input.parent_id ?? null, input.label, input.url, sortOrder, input.is_active ?? true]
  );

  return result.rows[0];
};

// Update menu item (admin)
export const updateMenuItem = async (
  itemId: string,
  input: { label?: string; url?: string; parent_id?: string | null; sort_order?: number; is_active?: boolean }
) => {
  const existing = await db.query("SELECT id, menu_id FROM menu_items WHERE id = $1", [itemId]);
  const item = existing.rows[0];
  if (!item) {
    throw new AppError("Menu item not found.", 404);
  }

  if (input.parent_id === itemId) {
    throw new AppError("Menu item cannot be its own parent.", 400);
  }

  if (input.parent_id) {
    const parent = await db.query(
      "SELECT id FROM menu_items WHERE id = $1 AND menu_id = $2",
      [input.parent_id, item.menu_id]
    );
    if (!parent.rows[0]) {
      throw new AppError("Parent menu item not found.", 404);
    }
  }

  const updates: string[] = [];
  const values: Array<string | number | boolean | null> = [];
  let index = 1;

  const setValue = (column: string, value: string | number | boolean | null | undefined) => {
    if (value === undefined) return;
    updates.push(`${column} = $${index++}`);
    values.push(value);
  };

  setValue("label", input.label);
  setValue("url", input.url);
  setValue("parent_id", input.parent_id);
  setValue("sort_order", input.sort_order);
  setValue("is_active", input.is_active ?? undefined);

  if (!updates.length) {
    const result = await db.query(
      `SELECT id, menu_id, parent_id, label, url, sort_order, is_active, created_at, updated_at
       FROM menu_items WHERE id = $1`,
      [itemId]
    );
    return result.rows[0];
  }

  updates.push("updated_at = NOW()");
  values.push(itemId);

  await db.query(`UPDATE menu_items SET ${updates.join(", ")} WHERE id = $${index}`, values);

  const result = await db.query(
    `SELECT id, menu_id, parent_id, label, url, sort_order, is_active, created_at, updated_at
     FROM menu_items WHERE id = $1`,
    [itemId]
  );

  return result.rows[0];
};

// Delete menu item (admin)
export const deleteMenuItem = async (itemId: string) => {
  const result = await db.query("DELETE FROM menu_items WHERE id = $1 RETURNING id", [itemId]);
  if (!result.rows[0]) {
    throw new AppError("Menu item not found.", 404);
  }

  return { id: result.rows[0].id };
};

// Reorder menu items (drag & drop)
export const reorderMenuItems = async (
  menuId: string,
  items: Array<{ id: string; sort_order: number; parent_id?: string | null }>
) => {
  if (items.some((item) => item.parent_id === item.id)) {
    throw new AppError("Menu item cannot be its own parent.", 400);
  }

  const ids = items.map((item) => item.id);
  const existing = await db.query<{ id: string }>(
    "SELECT id FROM menu_items WHERE menu_id = $1 AND id = ANY($2::uuid[])",
    [menuId, ids]
  );

  if (existing.rows.length !== items.length) {
    throw new AppError("One or more menu items are invalid.", 400);
  }

  const parentIds = items
    .map((item) => item.parent_id)
    .filter((parentId): parentId is string => Boolean(parentId));

  if (parentIds.length) {
    const parents = await db.query<{ id: string }>(
      "SELECT id FROM menu_items WHERE menu_id = $1 AND id = ANY($2::uuid[])",
      [menuId, parentIds]
    );

    if (parents.rows.length !== new Set(parentIds).size) {
      throw new AppError("One or more parent menu items are invalid.", 400);
    }
  }

  const pool = getPool();
  await pool.query("BEGIN");
  try {
    for (const item of items) {
      await db.query(
        `UPDATE menu_items
         SET sort_order = $1, parent_id = $2, updated_at = NOW()
         WHERE id = $3`,
        [item.sort_order, item.parent_id ?? null, item.id]
      );
    }

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }

  return { updated: items.length };
};
