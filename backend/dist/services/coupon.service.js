"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.listCoupons = exports.createCoupon = void 0;
const pool_1 = require("../database/pool");
const AppError_1 = require("../utils/AppError");
const normalizeCode = (code) => code.trim().toUpperCase();
const createCoupon = async (input) => {
    const code = normalizeCode(input.code);
    const existing = await pool_1.db.query("SELECT id FROM coupons WHERE code = $1", [code]);
    if (existing.rows.length) {
        throw new AppError_1.AppError("Coupon code already exists.", 409);
    }
    const result = await pool_1.db.query(`INSERT INTO coupons (code, type, amount, minimum_order, ends_at, is_active)
     VALUES ($1, $2, $3, $4, $5, TRUE)
     RETURNING id, code, type, amount, minimum_order, ends_at`, [
        code,
        input.discount_type,
        input.discount_value,
        input.minimum_order ?? 0,
        input.expiry_date ?? null
    ]);
    return result.rows[0];
};
exports.createCoupon = createCoupon;
const listCoupons = async () => {
    const result = await pool_1.db.query(`SELECT id, code, type, amount, minimum_order, max_redemptions, redeemed_count,
            starts_at, ends_at, is_active, created_at
     FROM coupons
     ORDER BY created_at DESC`);
    return result.rows;
};
exports.listCoupons = listCoupons;
const updateCoupon = async (couponId, input) => {
    const existing = await pool_1.db.query("SELECT id FROM coupons WHERE id = $1", [couponId]);
    if (!existing.rows[0]) {
        throw new AppError_1.AppError("Coupon not found.", 404);
    }
    if (input.code) {
        const normalized = normalizeCode(input.code);
        const dup = await pool_1.db.query("SELECT id FROM coupons WHERE code = $1 AND id <> $2", [
            normalized,
            couponId
        ]);
        if (dup.rows.length) {
            throw new AppError_1.AppError("Coupon code already exists.", 409);
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
    if (input.code) {
        setValue("code", normalizeCode(input.code));
    }
    setValue("type", input.discount_type);
    setValue("amount", input.discount_value);
    setValue("minimum_order", input.minimum_order);
    setValue("ends_at", input.expiry_date ?? null);
    if (!updates.length) {
        const current = await pool_1.db.query("SELECT id, code, type, amount, minimum_order, ends_at FROM coupons WHERE id = $1", [couponId]);
        return current.rows[0];
    }
    values.push(couponId);
    await pool_1.db.query(`UPDATE coupons SET ${updates.join(", ")} WHERE id = $${index}`, values);
    const updated = await pool_1.db.query("SELECT id, code, type, amount, minimum_order, ends_at FROM coupons WHERE id = $1", [couponId]);
    return updated.rows[0];
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (couponId) => {
    const removed = await pool_1.db.query("DELETE FROM coupons WHERE id = $1 RETURNING id", [couponId]);
    if (!removed.rows[0]) {
        throw new AppError_1.AppError("Coupon not found.", 404);
    }
    return { id: removed.rows[0].id };
};
exports.deleteCoupon = deleteCoupon;
