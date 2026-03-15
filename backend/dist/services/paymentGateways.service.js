"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleGateway = exports.updateGateway = exports.listGateways = void 0;
const pool_1 = require("../database/pool");
const AppError_1 = require("../utils/AppError");
const defaults = [
    { name: "bKash", gateway_code: "bkash" },
    { name: "Nagad", gateway_code: "nagad" },
    { name: "Rocket", gateway_code: "rocket" },
    { name: "Upay", gateway_code: "upay" },
    { name: "Cash on Delivery", gateway_code: "cash_on_delivery" }
];
const ensureDefaults = async () => {
    const existing = await pool_1.db.query("SELECT gateway_code FROM payment_gateways");
    const existingSet = new Set(existing.rows.map((row) => row.gateway_code));
    for (const gateway of defaults) {
        if (existingSet.has(gateway.gateway_code))
            continue;
        await pool_1.db.query(`INSERT INTO payment_gateways (name, gateway_code, is_active)
       VALUES ($1, $2, $3)
       ON CONFLICT (gateway_code) DO NOTHING`, [gateway.name, gateway.gateway_code, true]);
    }
};
const listGateways = async () => {
    await ensureDefaults();
    const result = await pool_1.db.query(`SELECT id, name, gateway_code, is_active, created_at, updated_at
     FROM payment_gateways
     ORDER BY created_at ASC`);
    return result.rows;
};
exports.listGateways = listGateways;
const updateGateway = async (id, input) => {
    const existing = await pool_1.db.query("SELECT id, gateway_code FROM payment_gateways WHERE id = $1", [id]);
    const gateway = existing.rows[0];
    if (!gateway) {
        throw new AppError_1.AppError("Payment gateway not found.", 404);
    }
    if (input.gateway_code && input.gateway_code !== gateway.gateway_code) {
        const dup = await pool_1.db.query("SELECT id FROM payment_gateways WHERE gateway_code = $1", [input.gateway_code]);
        if (dup.rows.length) {
            throw new AppError_1.AppError("Gateway code already exists.", 409);
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
    setValue("name", input.name);
    setValue("gateway_code", input.gateway_code);
    setValue("is_active", input.is_active);
    if (!updates.length) {
        const result = await pool_1.db.query(`SELECT id, name, gateway_code, is_active, created_at, updated_at
       FROM payment_gateways WHERE id = $1`, [id]);
        return result.rows[0];
    }
    updates.push("updated_at = NOW()");
    values.push(id);
    await pool_1.db.query(`UPDATE payment_gateways SET ${updates.join(", ")} WHERE id = $${index}`, values);
    const result = await pool_1.db.query(`SELECT id, name, gateway_code, is_active, created_at, updated_at
     FROM payment_gateways WHERE id = $1`, [id]);
    return result.rows[0];
};
exports.updateGateway = updateGateway;
const toggleGateway = async (id, isActive) => {
    const existing = await pool_1.db.query("SELECT id FROM payment_gateways WHERE id = $1", [id]);
    if (!existing.rows[0]) {
        throw new AppError_1.AppError("Payment gateway not found.", 404);
    }
    const result = await pool_1.db.query(`UPDATE payment_gateways
     SET is_active = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, gateway_code, is_active, created_at, updated_at`, [isActive, id]);
    return result.rows[0];
};
exports.toggleGateway = toggleGateway;
