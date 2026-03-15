import { db } from "../database/pool";

export const createNotification = async (input: {
  user_id?: string | null;
  role: "admin" | "customer";
  title: string;
  message: string;
  type: string;
}) => {
  await db.query(
    `INSERT INTO notifications (user_id, role, title, message, type)
     VALUES ($1, $2, $3, $4, $5)`,
    [input.user_id ?? null, input.role, input.title, input.message, input.type]
  );
};

export const listNotifications = async (input: { user_id?: string; role?: string }) => {
  const filters: string[] = [];
  const values: Array<string> = [];
  let index = 1;

  if (input.user_id) {
    filters.push(`user_id = $${index++}`);
    values.push(input.user_id);
  }

  if (input.role) {
    filters.push(`role = $${index++}`);
    values.push(input.role);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await db.query(
    `SELECT id, user_id, role, title, message, type, is_read, created_at
     FROM notifications
     ${whereClause}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows;
};
