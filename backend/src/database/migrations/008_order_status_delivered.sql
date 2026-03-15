-- 008_order_status_delivered.sql
-- Ensure order status supports delivered

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'canceled', 'cancelled', 'refunded'));
