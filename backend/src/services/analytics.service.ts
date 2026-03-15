import { db } from "../database/pool";

const activeOrderFilter = "status NOT IN ('cancelled','canceled')";

// Overview metrics for dashboard
export const getOverviewStats = async () => {
  const [dailySalesResult, monthlyRevenueResult, ordersResult, customersResult, productsResult] =
    await Promise.all([
      db.query(
        `SELECT COALESCE(SUM(total), 0) AS daily_sales
         FROM orders
         WHERE ${activeOrderFilter}
           AND DATE(created_at) = CURRENT_DATE`
      ),
      db.query(
        `SELECT COALESCE(SUM(total), 0) AS monthly_revenue
         FROM orders
         WHERE ${activeOrderFilter}
           AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`
      ),
      db.query(
        `SELECT COUNT(*)::int AS orders
         FROM orders
         WHERE ${activeOrderFilter}`
      ),
      db.query(
        `SELECT COUNT(*)::int AS customers
         FROM users
         WHERE role = 'customer'`
      ),
      db.query(`SELECT COUNT(*)::int AS products FROM products`)
    ]);

  return {
    daily_sales: Number(dailySalesResult.rows[0].daily_sales),
    monthly_revenue: Number(monthlyRevenueResult.rows[0].monthly_revenue),
    orders: ordersResult.rows[0].orders,
    customers: customersResult.rows[0].customers,
    products: productsResult.rows[0].products
  };
};

// Daily sales totals for chart
export const getSalesSeries = async (days: number) => {
  const result = await db.query(
    `SELECT DATE(created_at) AS day, COALESCE(SUM(total), 0) AS amount
     FROM orders
     WHERE ${activeOrderFilter}
       AND created_at >= CURRENT_DATE - $1::int
     GROUP BY day
     ORDER BY day ASC`,
    [days]
  );

  return result.rows.map((row: any) => ({
    day: row.day,
    amount: Number(row.amount)
  }));
};

// Monthly revenue totals for chart
export const getRevenueSeries = async (months: number) => {
  const result = await db.query(
    `SELECT DATE_TRUNC('month', created_at) AS month, COALESCE(SUM(total), 0) AS amount
     FROM orders
     WHERE ${activeOrderFilter}
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE) - ($1::int || ' months')::interval
     GROUP BY month
     ORDER BY month ASC`,
    [months]
  );

  return result.rows.map((row: any) => ({
    month: row.month,
    amount: Number(row.amount)
  }));
};

// Top products by revenue
export const getTopProducts = async (limit: number) => {
  const result = await db.query(
    `SELECT p.name AS product_name,
            SUM(oi.quantity)::int AS units_sold,
            COALESCE(SUM(oi.quantity * oi.price), 0) AS revenue
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     JOIN products p ON p.id = oi.product_id
     WHERE ${activeOrderFilter}
     GROUP BY p.name
     ORDER BY revenue DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map((row: any) => ({
    product_name: row.product_name,
    units_sold: row.units_sold,
    revenue: Number(row.revenue)
  }));
};
