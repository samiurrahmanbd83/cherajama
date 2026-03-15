import { db } from "../database/pool";
import { AppError } from "../utils/AppError";

// Get the latest announcement (public)
export const getAnnouncement = async () => {
  const result = await db.query(
    `SELECT id, message, link_url, background_color, text_color, is_active,
            created_at, updated_at
     FROM announcements
     ORDER BY created_at DESC
     LIMIT 1`
  );
  return result.rows[0] || null;
};

// Create announcement (admin)
export const createAnnouncement = async (input: {
  message: string;
  link_url?: string;
  background_color?: string;
  text_color?: string;
  is_active?: boolean;
}) => {
  const isActive = input.is_active ?? true;

  if (isActive) {
    await db.query("UPDATE announcements SET is_active = FALSE");
  }

  const result = await db.query(
    `INSERT INTO announcements (message, link_url, background_color, text_color, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, message, link_url, background_color, text_color, is_active,
               created_at, updated_at`,
    [
      input.message,
      input.link_url ?? null,
      input.background_color ?? "#111827",
      input.text_color ?? "#ffffff",
      isActive
    ]
  );

  return result.rows[0];
};

// Update announcement (admin)
export const updateAnnouncement = async (
  id: string,
  input: {
    message?: string;
    link_url?: string | null;
    background_color?: string;
    text_color?: string;
    is_active?: boolean;
  }
) => {
  const existing = await db.query("SELECT id FROM announcements WHERE id = $1", [id]);
  if (!existing.rows[0]) {
    throw new AppError("Announcement not found.", 404);
  }

  if (input.is_active === true) {
    await db.query("UPDATE announcements SET is_active = FALSE WHERE id <> $1", [id]);
  }

  const updates: string[] = [];
  const values: Array<string | boolean | null> = [];
  let index = 1;

  const setValue = (column: string, value: string | boolean | null | undefined) => {
    if (value === undefined) return;
    updates.push(`${column} = $${index++}`);
    values.push(value);
  };

  setValue("message", input.message);
  setValue("link_url", input.link_url ?? undefined);
  setValue("background_color", input.background_color);
  setValue("text_color", input.text_color);
  setValue("is_active", input.is_active ?? undefined);

  if (!updates.length) {
    const result = await db.query(
      `SELECT id, message, link_url, background_color, text_color, is_active,
              created_at, updated_at
       FROM announcements WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  updates.push("updated_at = NOW()");
  values.push(id);

  await db.query(`UPDATE announcements SET ${updates.join(", ")} WHERE id = $${index}`, values);

  const result = await db.query(
    `SELECT id, message, link_url, background_color, text_color, is_active,
            created_at, updated_at
     FROM announcements WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

// Toggle announcement (admin)
export const toggleAnnouncement = async (isActive: boolean) => {
  const current = await getAnnouncement();
  if (!current) {
    throw new AppError("Announcement not found.", 404);
  }

  if (isActive) {
    await db.query("UPDATE announcements SET is_active = FALSE");
  }

  const result = await db.query(
    `UPDATE announcements
     SET is_active = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, message, link_url, background_color, text_color, is_active,
               created_at, updated_at`,
    [isActive, current.id]
  );

  return result.rows[0];
};
