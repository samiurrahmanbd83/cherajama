"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAnnouncement = exports.updateAnnouncement = exports.createAnnouncement = exports.getAnnouncement = void 0;
const pool_1 = require("../database/pool");
const AppError_1 = require("../utils/AppError");
// Get the latest announcement (public)
const getAnnouncement = async () => {
    const result = await pool_1.db.query(`SELECT id, message, link_url, background_color, text_color, is_active,
            created_at, updated_at
     FROM announcements
     ORDER BY created_at DESC
     LIMIT 1`);
    return result.rows[0] || null;
};
exports.getAnnouncement = getAnnouncement;
// Create announcement (admin)
const createAnnouncement = async (input) => {
    const isActive = input.is_active ?? true;
    if (isActive) {
        await pool_1.db.query("UPDATE announcements SET is_active = FALSE");
    }
    const result = await pool_1.db.query(`INSERT INTO announcements (message, link_url, background_color, text_color, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, message, link_url, background_color, text_color, is_active,
               created_at, updated_at`, [
        input.message,
        input.link_url ?? null,
        input.background_color ?? "#111827",
        input.text_color ?? "#ffffff",
        isActive
    ]);
    return result.rows[0];
};
exports.createAnnouncement = createAnnouncement;
// Update announcement (admin)
const updateAnnouncement = async (id, input) => {
    const existing = await pool_1.db.query("SELECT id FROM announcements WHERE id = $1", [id]);
    if (!existing.rows[0]) {
        throw new AppError_1.AppError("Announcement not found.", 404);
    }
    if (input.is_active === true) {
        await pool_1.db.query("UPDATE announcements SET is_active = FALSE WHERE id <> $1", [id]);
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
    setValue("message", input.message);
    setValue("link_url", input.link_url ?? undefined);
    setValue("background_color", input.background_color);
    setValue("text_color", input.text_color);
    setValue("is_active", input.is_active ?? undefined);
    if (!updates.length) {
        const result = await pool_1.db.query(`SELECT id, message, link_url, background_color, text_color, is_active,
              created_at, updated_at
       FROM announcements WHERE id = $1`, [id]);
        return result.rows[0];
    }
    updates.push("updated_at = NOW()");
    values.push(id);
    await pool_1.db.query(`UPDATE announcements SET ${updates.join(", ")} WHERE id = $${index}`, values);
    const result = await pool_1.db.query(`SELECT id, message, link_url, background_color, text_color, is_active,
            created_at, updated_at
     FROM announcements WHERE id = $1`, [id]);
    return result.rows[0];
};
exports.updateAnnouncement = updateAnnouncement;
// Toggle announcement (admin)
const toggleAnnouncement = async (isActive) => {
    const current = await (0, exports.getAnnouncement)();
    if (!current) {
        throw new AppError_1.AppError("Announcement not found.", 404);
    }
    if (isActive) {
        await pool_1.db.query("UPDATE announcements SET is_active = FALSE");
    }
    const result = await pool_1.db.query(`UPDATE announcements
     SET is_active = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, message, link_url, background_color, text_color, is_active,
               created_at, updated_at`, [isActive, current.id]);
    return result.rows[0];
};
exports.toggleAnnouncement = toggleAnnouncement;
