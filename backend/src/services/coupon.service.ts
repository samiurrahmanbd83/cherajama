import { db } from "../database/pool";
import { AppError } from "../utils/AppError";

const normalizeCode = (code: string) => code.trim().toUpperCase();

export const createCoupon = async (input: {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  minimum_order?: number;
  expiry_date?: string;
}) => {
  const code = normalizeCode(input.code);

  const existing = await db.query("SELECT id FROM coupons WHERE code = $1", [code]);
  if (existing.rows.length) {
    throw new AppError("Coupon code already exists.", 409);
  }

  const result = await db.query(
    `INSERT INTO coupons (code, type, amount, minimum_order, ends_at, is_active)
     VALUES ($1, $2, $3, $4, $5, TRUE)
     RETURNING id, code, type, amount, minimum_order, ends_at`,
    [
      code,
      input.discount_type,
      input.discount_value,
      input.minimum_order ?? 0,
      input.expiry_date ?? null
    ]
  );

  return result.rows[0];
};

export const listCoupons = async () => {
  const result = await db.query(
    `SELECT id, code, type, amount, minimum_order, max_redemptions, redeemed_count,
            starts_at, ends_at, is_active, created_at
     FROM coupons
     ORDER BY created_at DESC`
  );

  return result.rows;
};

export const updateCoupon = async (
  couponId: string,
  input: {
    code?: string;
    discount_type?: "percentage" | "fixed";
    discount_value?: number;
    minimum_order?: number;
    expiry_date?: string;
  }
) => {
  const existing = await db.query("SELECT id FROM coupons WHERE id = $1", [couponId]);
  if (!existing.rows[0]) {
    throw new AppError("Coupon not found.", 404);
  }

  if (input.code) {
    const normalized = normalizeCode(input.code);
    const dup = await db.query("SELECT id FROM coupons WHERE code = $1 AND id <> $2", [
      normalized,
      couponId
    ]);
    if (dup.rows.length) {
      throw new AppError("Coupon code already exists.", 409);
    }
  }

  const updates: string[] = [];
  const values: Array<string | number | null> = [];
  let index = 1;

  const setValue = (column: string, value: string | number | null | undefined) => {
    if (value === undefined) return;
    updates.push(`${column} = $${index++}`);
    values.push(value);
  };

  if (input.code) {
    setValue("code", normalizeCode(input.code));
  }
  setValue("type", input.discount_type);
  setValue("amount", input.discount_value);
  setValue("minimum_order", input.minimum_order);
  setValue("ends_at", input.expiry_date ?? null);

  if (!updates.length) {
    const current = await db.query(
      "SELECT id, code, type, amount, minimum_order, ends_at FROM coupons WHERE id = $1",
      [couponId]
    );
    return current.rows[0];
  }

  values.push(couponId);
  await db.query(`UPDATE coupons SET ${updates.join(", ")} WHERE id = $${index}`, values);

  const updated = await db.query(
    "SELECT id, code, type, amount, minimum_order, ends_at FROM coupons WHERE id = $1",
    [couponId]
  );

  return updated.rows[0];
};

export const deleteCoupon = async (couponId: string) => {
  const removed = await db.query("DELETE FROM coupons WHERE id = $1 RETURNING id", [couponId]);
  if (!removed.rows[0]) {
    throw new AppError("Coupon not found.", 404);
  }

  return { id: removed.rows[0].id };
};
