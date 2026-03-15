import { db } from "../database/pool";
import { AppError } from "../utils/AppError";

export const listReviewsByProduct = async (productId: string) => {
  const result = await db.query(
    `SELECT r.id, r.rating, r.body AS comment, r.created_at,
            u.first_name, u.last_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    user_name: `${row.first_name} ${row.last_name}`.trim(),
    review_date: row.created_at
  }));
};

export const createReview = async (userId: string, productId: string, input: {
  rating: number;
  comment: string;
}) => {
  const product = await db.query("SELECT id FROM products WHERE id = $1", [productId]);
  if (!product.rows[0]) {
    throw new AppError("Product not found.", 404);
  }

  const existing = await db.query(
    "SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2",
    [productId, userId]
  );
  if (existing.rows.length) {
    throw new AppError("You already reviewed this product.", 409);
  }

  const created = await db.query(
    `INSERT INTO reviews (product_id, user_id, rating, body, is_approved)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING id, rating, body, created_at`,
    [productId, userId, input.rating, input.comment]
  );

  const user = await db.query("SELECT first_name, last_name FROM users WHERE id = $1", [userId]);
  const name = user.rows[0]
    ? `${user.rows[0].first_name} ${user.rows[0].last_name}`.trim()
    : "Customer";

  return {
    id: created.rows[0].id,
    rating: created.rows[0].rating,
    comment: created.rows[0].body,
    user_name: name,
    review_date: created.rows[0].created_at
  };
};

export const listAllReviews = async (input: { limit?: number; offset?: number; status?: string }) => {
  const filters: string[] = [];
  const values: Array<string | number> = [];
  let index = 1;

  if (input.status === "approved") {
    filters.push(`r.is_approved = TRUE`);
  } else if (input.status === "pending") {
    filters.push(`r.is_approved = FALSE`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const limit = input.limit ?? 50;
  const offset = input.offset ?? 0;

  values.push(limit, offset);

  const result = await db.query(
    `SELECT r.id, r.rating, r.title, r.body, r.is_approved, r.created_at,
            p.id AS product_id, p.name AS product_name, p.slug AS product_slug,
            u.id AS user_id, u.first_name, u.last_name, u.email
     FROM reviews r
     JOIN products p ON p.id = r.product_id
     LEFT JOIN users u ON u.id = r.user_id
     ${whereClause}
     ORDER BY r.created_at DESC
     LIMIT $${index} OFFSET $${index + 1}`,
    values
  );

  return result.rows.map((row: any) => ({
    id: row.id,
    rating: row.rating,
    title: row.title,
    comment: row.body,
    is_approved: row.is_approved,
    review_date: row.created_at,
    product: {
      id: row.product_id,
      name: row.product_name,
      slug: row.product_slug
    },
    user: {
      id: row.user_id,
      name: `${row.first_name || ""} ${row.last_name || ""}`.trim() || "Customer",
      email: row.email
    }
  }));
};

export const updateReviewApproval = async (reviewId: string, isApproved: boolean) => {
  const updated = await db.query(
    `UPDATE reviews
     SET is_approved = $1
     WHERE id = $2
     RETURNING id, rating, title, body, is_approved, created_at`,
    [isApproved, reviewId]
  );

  if (!updated.rows[0]) {
    throw new AppError("Review not found.", 404);
  }

  return updated.rows[0];
};
