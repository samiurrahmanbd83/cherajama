"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotifications = exports.createNotification = void 0;
const pool_1 = require("../database/pool");
const createNotification = async (input) => {
    await pool_1.db.query(`INSERT INTO notifications (user_id, role, title, message, type)
     VALUES ($1, $2, $3, $4, $5)`, [input.user_id ?? null, input.role, input.title, input.message, input.type]);
};
exports.createNotification = createNotification;
const listNotifications = async (input) => {
    const filters = [];
    const values = [];
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
    const result = await pool_1.db.query(`SELECT id, user_id, role, title, message, type, is_read, created_at
     FROM notifications
     ${whereClause}
     ORDER BY created_at DESC`, values);
    return result.rows;
};
exports.listNotifications = listNotifications;
