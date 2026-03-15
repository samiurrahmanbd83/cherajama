"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorder = exports.removeItem = exports.updateItem = exports.addItem = exports.remove = exports.update = exports.create = exports.getBySlug = exports.list = void 0;
const request_1 = require("../utils/request");
const menu_service_1 = require("../services/menu.service");
// List menus (public)
const list = async (_req, res) => {
    const menus = await (0, menu_service_1.listMenus)();
    res.status(200).json({ success: true, data: { menus } });
};
exports.list = list;
// Get menu details by slug (public)
const getBySlug = async (req, res) => {
    const menu = await (0, menu_service_1.getMenuBySlug)((0, request_1.getParam)(req.params, "slug"));
    res.status(200).json({ success: true, data: { menu } });
};
exports.getBySlug = getBySlug;
// Create menu (admin)
const create = async (req, res) => {
    const menu = await (0, menu_service_1.createMenu)(req.body);
    res.status(201).json({ success: true, data: { menu } });
};
exports.create = create;
// Update menu (admin)
const update = async (req, res) => {
    const menu = await (0, menu_service_1.updateMenu)((0, request_1.getParam)(req.params, "id"), req.body);
    res.status(200).json({ success: true, data: { menu } });
};
exports.update = update;
// Delete menu (admin)
const remove = async (req, res) => {
    const result = await (0, menu_service_1.deleteMenu)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: result });
};
exports.remove = remove;
// Add menu item (admin)
const addItem = async (req, res) => {
    const item = await (0, menu_service_1.addMenuItem)((0, request_1.getParam)(req.params, "id"), req.body);
    res.status(201).json({ success: true, data: { item } });
};
exports.addItem = addItem;
// Update menu item (admin)
const updateItem = async (req, res) => {
    const item = await (0, menu_service_1.updateMenuItem)((0, request_1.getParam)(req.params, "itemId"), req.body);
    res.status(200).json({ success: true, data: { item } });
};
exports.updateItem = updateItem;
// Delete menu item (admin)
const removeItem = async (req, res) => {
    const result = await (0, menu_service_1.deleteMenuItem)((0, request_1.getParam)(req.params, "itemId"));
    res.status(200).json({ success: true, data: result });
};
exports.removeItem = removeItem;
// Reorder menu items (admin)
const reorder = async (req, res) => {
    const result = await (0, menu_service_1.reorderMenuItems)((0, request_1.getParam)(req.params, "id"), req.body.items);
    res.status(200).json({ success: true, data: result });
};
exports.reorder = reorder;
