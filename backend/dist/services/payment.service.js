"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentAnalytics = exports.updateDisputeStatus = exports.listDisputes = exports.createDispute = exports.rejectPayment = exports.verifyPayment = exports.getRiskReport = exports.listPaymentLogs = exports.listPendingPayments = exports.listPayments = exports.submitPayment = void 0;
const pool_1 = require("../database/pool");
const AppError_1 = require("../utils/AppError");
const notification_service_1 = require("./notification.service");
const phoneRegex = /^\+?\d{10,15}$/;
const defaultGateways = [
    { name: "bKash", gateway_code: "bkash" },
    { name: "Nagad", gateway_code: "nagad" },
    { name: "Rocket", gateway_code: "rocket" },
    { name: "Upay", gateway_code: "upay" },
    { name: "Cash on Delivery", gateway_code: "cash_on_delivery" }
];
const getActiveGateways = async () => {
    const existing = await pool_1.db.query("SELECT COUNT(*)::int AS count FROM payment_gateways");
    if (existing.rows[0].count === 0) {
        for (const gateway of defaultGateways) {
            await pool_1.db.query(`INSERT INTO payment_gateways (name, gateway_code, is_active)
         VALUES ($1, $2, $3)
         ON CONFLICT (gateway_code) DO NOTHING`, [gateway.name, gateway.gateway_code, true]);
        }
    }
    const result = await pool_1.db.query(`SELECT gateway_code
     FROM payment_gateways
     WHERE is_active = TRUE`);
    return result.rows.map((row) => row.gateway_code);
};
const getFailedAttempts = async (orderId) => {
    const result = await pool_1.db.query(`SELECT failed_attempts
     FROM payment_attempts
     WHERE order_id = $1`, [orderId]);
    return result.rows[0]?.failed_attempts ?? 0;
};
const recordFailedAttempt = async (orderId, userId) => {
    const existing = await pool_1.db.query(`SELECT id, failed_attempts
     FROM payment_attempts
     WHERE order_id = $1`, [orderId]);
    if (!existing.rows[0]) {
        await pool_1.db.query(`INSERT INTO payment_attempts (order_id, user_id, failed_attempts, last_failed_at)
       VALUES ($1, $2, 1, NOW())`, [orderId, userId]);
        return 1;
    }
    const updated = await pool_1.db.query(`UPDATE payment_attempts
     SET failed_attempts = failed_attempts + 1,
         last_failed_at = NOW(),
         updated_at = NOW()
     WHERE order_id = $1
     RETURNING failed_attempts`, [orderId]);
    return updated.rows[0].failed_attempts;
};
const resetFailedAttempts = async (orderId) => {
    await pool_1.db.query(`UPDATE payment_attempts
     SET failed_attempts = 0,
         updated_at = NOW()
     WHERE order_id = $1`, [orderId]);
};
const isBlacklisted = async (phone) => {
    if (!phone)
        return false;
    const result = await pool_1.db.query(`SELECT id
     FROM payment_blacklist
     WHERE phone = $1 AND is_active = TRUE`, [phone]);
    return Boolean(result.rows[0]);
};
const createPaymentLog = async (input) => {
    await pool_1.db.query(`INSERT INTO payment_logs
      (order_id, customer_id, payment_method, sender_phone, transaction_id, amount, payment_status, risk_score, action)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
        input.order_id,
        input.customer_id,
        input.payment_method ?? null,
        input.sender_phone ?? null,
        input.transaction_id ?? null,
        input.amount ?? null,
        input.payment_status ?? null,
        input.risk_score ?? 0,
        input.action
    ]);
};
const computeRisk = (flags) => {
    let score = 0;
    if (flags.includes("duplicate_transaction"))
        score += 90;
    if (flags.includes("blacklisted_phone"))
        score += 90;
    if (flags.includes("too_many_failed"))
        score += 60;
    if (flags.includes("invalid_phone"))
        score += 50;
    if (flags.includes("invalid_transaction"))
        score += 40;
    if (flags.includes("amount_mismatch"))
        score += 40;
    if (flags.includes("gateway_inactive"))
        score += 30;
    if (score > 100)
        score = 100;
    let level = "low";
    if (score >= 71)
        level = "high";
    else if (score >= 31)
        level = "medium";
    return { score, level, flags };
};
const markOrderRisk = async (orderId, risk) => {
    await pool_1.db.query(`UPDATE orders
     SET risk_score = $1,
         risk_level = $2,
         is_suspicious = $3,
         updated_at = NOW()
     WHERE id = $4`, [risk.score, risk.level, risk.level === "high" || risk.flags.length > 0, orderId]);
};
const submitPayment = async (userId, input) => {
    const orderResult = await pool_1.db.query(`SELECT id, user_id, payment_status, status, total
     FROM orders
     WHERE id = $1`, [input.order_id]);
    const order = orderResult.rows[0];
    if (!order) {
        throw new AppError_1.AppError("Order not found.", 404);
    }
    if (order.user_id !== userId) {
        throw new AppError_1.AppError("You do not have access to this order.", 403);
    }
    if (order.payment_status === "paid") {
        throw new AppError_1.AppError("Payment already verified.", 409);
    }
    const failedAttempts = await getFailedAttempts(input.order_id);
    if (failedAttempts >= 3) {
        const risk = computeRisk(["too_many_failed"]);
        await markOrderRisk(input.order_id, risk);
        await createPaymentLog({
            order_id: input.order_id,
            customer_id: userId,
            payment_method: input.payment_method,
            sender_phone: input.sender_phone,
            transaction_id: input.transaction_id,
            amount: input.paid_amount,
            payment_status: "failed",
            risk_score: risk.score,
            action: "blocked"
        });
        await (0, notification_service_1.createNotification)({
            role: "admin",
            title: "Suspicious payment attempt",
            message: `Order ${input.order_id} blocked due to repeated failed attempts.`,
            type: "payment_suspicious"
        });
        throw new AppError_1.AppError("Too many failed attempts. Please contact support.", 429);
    }
    const activeGateways = await getActiveGateways();
    const flags = [];
    const blockingFlags = [];
    if (!activeGateways.includes(input.payment_method)) {
        flags.push("gateway_inactive");
        blockingFlags.push("gateway_inactive");
    }
    const phoneValid = input.sender_phone ? phoneRegex.test(input.sender_phone) : true;
    if (input.payment_method !== "cash_on_delivery" && !phoneValid) {
        flags.push("invalid_phone");
        blockingFlags.push("invalid_phone");
    }
    if (input.payment_method !== "cash_on_delivery" && (!input.transaction_id || input.transaction_id.length < 6)) {
        flags.push("invalid_transaction");
        blockingFlags.push("invalid_transaction");
    }
    if (input.transaction_id) {
        const existingTxn = await pool_1.db.query(`SELECT id FROM payment_logs WHERE transaction_id = $1
       UNION
       SELECT id FROM orders WHERE transaction_id = $1`, [input.transaction_id]);
        if (existingTxn.rows.length) {
            flags.push("duplicate_transaction");
            blockingFlags.push("duplicate_transaction");
        }
    }
    if (await isBlacklisted(input.sender_phone)) {
        flags.push("blacklisted_phone");
        blockingFlags.push("blacklisted_phone");
    }
    const amountMismatch = Number(order.total) !== Number(input.paid_amount);
    if (amountMismatch) {
        flags.push("amount_mismatch");
    }
    if (blockingFlags.length) {
        const risk = computeRisk(flags);
        await markOrderRisk(input.order_id, risk);
        await recordFailedAttempt(input.order_id, userId);
        await createPaymentLog({
            order_id: input.order_id,
            customer_id: userId,
            payment_method: input.payment_method,
            sender_phone: input.sender_phone,
            transaction_id: input.transaction_id,
            amount: input.paid_amount,
            payment_status: "failed",
            risk_score: risk.score,
            action: "validation_failed"
        });
        await (0, notification_service_1.createNotification)({
            role: "admin",
            title: "Suspicious transaction detected",
            message: `Order ${input.order_id} flagged for ${blockingFlags.join(", ")}.`,
            type: "payment_suspicious"
        });
        throw new AppError_1.AppError("Payment validation failed. Please review your details.", 400);
    }
    const risk = computeRisk(flags);
    const updated = await pool_1.db.query(`UPDATE orders
     SET payment_method = $1,
         sender_phone = $2,
         transaction_id = $3,
         paid_amount = $4,
         payment_status = 'pending_verification',
         verification_status = 'pending',
         status = 'pending',
         risk_score = $5,
         risk_level = $6,
         is_suspicious = $7,
         updated_at = NOW()
     WHERE id = $8
     RETURNING id, order_number, payment_status, verification_status, status, risk_score, risk_level, is_suspicious`, [
        input.payment_method,
        input.sender_phone ?? null,
        input.transaction_id ?? null,
        input.paid_amount,
        risk.score,
        risk.level,
        risk.level === "high" || risk.flags.length > 0,
        input.order_id
    ]);
    await resetFailedAttempts(input.order_id);
    await createPaymentLog({
        order_id: input.order_id,
        customer_id: userId,
        payment_method: input.payment_method,
        sender_phone: input.sender_phone,
        transaction_id: input.transaction_id,
        amount: input.paid_amount,
        payment_status: "pending_verification",
        risk_score: risk.score,
        action: risk.flags.length ? "submitted_suspicious" : "submitted"
    });
    await (0, notification_service_1.createNotification)({
        role: "customer",
        user_id: userId,
        title: "Payment submitted",
        message: `Your payment for order ${updated.rows[0].order_number} is pending verification.`,
        type: "payment_submitted"
    });
    await (0, notification_service_1.createNotification)({
        role: "admin",
        title: "New payment received",
        message: `Order ${updated.rows[0].order_number} is awaiting verification.`,
        type: "payment_received"
    });
    if (risk.level === "high") {
        await (0, notification_service_1.createNotification)({
            role: "admin",
            title: "Suspicious transaction detected",
            message: `Order ${updated.rows[0].order_number} flagged with high risk score ${risk.score}.`,
            type: "payment_suspicious"
        });
    }
    return updated.rows[0];
};
exports.submitPayment = submitPayment;
const listPayments = async (filters) => {
    const clauses = [];
    const values = [];
    let index = 1;
    if (filters?.status) {
        clauses.push(`payment_status = $${index++}`);
        values.push(filters.status);
    }
    if (filters?.risk) {
        clauses.push(`risk_level = $${index++}`);
        values.push(filters.risk);
    }
    const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const result = await pool_1.db.query(`SELECT id, order_number, customer_name, customer_phone, customer_email,
            payment_method, sender_phone, transaction_id, payment_status, verification_status,
            status, total, paid_amount, risk_score, risk_level, is_suspicious, created_at
     FROM orders
     ${whereClause}
     ORDER BY created_at DESC`, values);
    return result.rows;
};
exports.listPayments = listPayments;
const listPendingPayments = async () => {
    const result = await pool_1.db.query(`SELECT id, order_number, customer_name, customer_phone, customer_email,
            payment_method, sender_phone, transaction_id, payment_status, verification_status,
            status, total, paid_amount, risk_score, risk_level, is_suspicious, created_at
     FROM orders
     WHERE payment_status = 'pending_verification'
     ORDER BY created_at DESC`);
    return result.rows;
};
exports.listPendingPayments = listPendingPayments;
const listPaymentLogs = async (orderId) => {
    const result = await pool_1.db.query(`SELECT id, order_id, customer_id, payment_method, sender_phone, transaction_id, amount,
            payment_status, risk_score, action, created_at
     FROM payment_logs
     ${orderId ? "WHERE order_id = $1" : ""}
     ORDER BY created_at DESC`, orderId ? [orderId] : []);
    return result.rows;
};
exports.listPaymentLogs = listPaymentLogs;
const getRiskReport = async (level) => {
    const clause = level ? "WHERE risk_level = $1" : "WHERE is_suspicious = TRUE";
    const values = level ? [level] : [];
    const result = await pool_1.db.query(`SELECT id, order_number, customer_name, customer_phone, customer_email,
            payment_method, sender_phone, transaction_id, total, paid_amount,
            risk_score, risk_level, is_suspicious, payment_status, created_at
     FROM orders
     ${clause}
     ORDER BY risk_score DESC, created_at DESC`, values);
    return result.rows;
};
exports.getRiskReport = getRiskReport;
const verifyPayment = async (orderId) => {
    const updated = await pool_1.db.query(`UPDATE orders
     SET payment_status = 'paid',
         verification_status = 'approved',
         status = 'processing',
         updated_at = NOW()
     WHERE id = $1 AND payment_status = 'pending_verification'
     RETURNING id, order_number, payment_status, verification_status, status, user_id`, [orderId]);
    if (!updated.rows[0]) {
        throw new AppError_1.AppError("Order not found or not pending verification.", 404);
    }
    await createPaymentLog({
        order_id: orderId,
        customer_id: updated.rows[0].user_id,
        payment_status: "paid",
        action: "approved"
    });
    await (0, notification_service_1.createNotification)({
        role: "customer",
        user_id: updated.rows[0].user_id,
        title: "Payment approved",
        message: `Your payment for order ${updated.rows[0].order_number} has been approved.`,
        type: "payment_approved"
    });
    return updated.rows[0];
};
exports.verifyPayment = verifyPayment;
const rejectPayment = async (orderId) => {
    const updated = await pool_1.db.query(`UPDATE orders
     SET payment_status = 'failed',
         verification_status = 'rejected',
         status = 'cancelled',
         updated_at = NOW()
     WHERE id = $1 AND payment_status = 'pending_verification'
     RETURNING id, order_number, payment_status, verification_status, status, user_id`, [orderId]);
    if (!updated.rows[0]) {
        throw new AppError_1.AppError("Order not found or not pending verification.", 404);
    }
    await createPaymentLog({
        order_id: orderId,
        customer_id: updated.rows[0].user_id,
        payment_status: "failed",
        action: "rejected"
    });
    await (0, notification_service_1.createNotification)({
        role: "customer",
        user_id: updated.rows[0].user_id,
        title: "Payment rejected",
        message: `Your payment for order ${updated.rows[0].order_number} was rejected.`,
        type: "payment_rejected"
    });
    return updated.rows[0];
};
exports.rejectPayment = rejectPayment;
const createDispute = async (userId, input) => {
    const order = await pool_1.db.query("SELECT id, user_id FROM orders WHERE id = $1", [input.order_id]);
    if (!order.rows[0]) {
        throw new AppError_1.AppError("Order not found.", 404);
    }
    if (order.rows[0].user_id !== userId) {
        throw new AppError_1.AppError("You do not have access to this order.", 403);
    }
    const result = await pool_1.db.query(`INSERT INTO payment_disputes
      (order_id, user_id, payment_method, transaction_id, description, screenshot_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'open')
     RETURNING id, order_id, payment_method, transaction_id, description, screenshot_url, status, created_at`, [
        input.order_id,
        userId,
        input.payment_method,
        input.transaction_id,
        input.description,
        input.screenshot_url ?? null
    ]);
    await (0, notification_service_1.createNotification)({
        role: "admin",
        title: "New payment dispute",
        message: `Dispute created for order ${input.order_id}.`,
        type: "payment_dispute"
    });
    return result.rows[0];
};
exports.createDispute = createDispute;
const listDisputes = async () => {
    const result = await pool_1.db.query(`SELECT id, order_id, user_id, payment_method, transaction_id, description, screenshot_url, status, created_at, updated_at
     FROM payment_disputes
     ORDER BY created_at DESC`);
    return result.rows;
};
exports.listDisputes = listDisputes;
const updateDisputeStatus = async (id, status) => {
    const updated = await pool_1.db.query(`UPDATE payment_disputes
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, order_id, user_id, status`, [status, id]);
    if (!updated.rows[0]) {
        throw new AppError_1.AppError("Dispute not found.", 404);
    }
    return updated.rows[0];
};
exports.updateDisputeStatus = updateDisputeStatus;
const getPaymentAnalytics = async (days = 30) => {
    const dailyRevenue = await pool_1.db.query(`SELECT DATE(created_at) AS day, COALESCE(SUM(total), 0) AS amount
     FROM orders
     WHERE payment_status = 'paid'
       AND created_at >= CURRENT_DATE - $1::int
     GROUP BY day
     ORDER BY day ASC`, [days]);
    const monthlyRevenue = await pool_1.db.query(`SELECT DATE_TRUNC('month', created_at) AS month, COALESCE(SUM(total), 0) AS amount
     FROM orders
     WHERE payment_status = 'paid'
     GROUP BY month
     ORDER BY month ASC`);
    const methodDistribution = await pool_1.db.query(`SELECT payment_method, COUNT(*)::int AS count
     FROM orders
     WHERE payment_status = 'paid'
     GROUP BY payment_method
     ORDER BY count DESC`);
    const statusDistribution = await pool_1.db.query(`SELECT payment_status, COUNT(*)::int AS count
     FROM orders
     GROUP BY payment_status`);
    const fraudReport = await pool_1.db.query(`SELECT risk_level, COUNT(*)::int AS count
     FROM orders
     WHERE is_suspicious = TRUE
     GROUP BY risk_level`);
    return {
        daily_revenue: dailyRevenue.rows.map((row) => ({
            day: row.day,
            amount: Number(row.amount)
        })),
        monthly_revenue: monthlyRevenue.rows.map((row) => ({
            month: row.month,
            amount: Number(row.amount)
        })),
        payment_method_distribution: methodDistribution.rows,
        payment_status_distribution: statusDistribution.rows,
        fraud_report: fraudReport.rows
    };
};
exports.getPaymentAnalytics = getPaymentAnalytics;
