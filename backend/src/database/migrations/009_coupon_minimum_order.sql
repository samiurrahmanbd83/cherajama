-- 009_coupon_minimum_order.sql
-- Add minimum_order to coupons

ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS minimum_order NUMERIC(10, 2) NOT NULL DEFAULT 0;
