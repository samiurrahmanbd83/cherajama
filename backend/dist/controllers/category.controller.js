"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.list = void 0;
const request_1 = require("../utils/request");
const category_service_1 = require("../services/category.service");
// List categories (public)
const list = async (_req, res) => {
    const categories = await (0, category_service_1.listCategories)();
    res.status(200).json({ success: true, data: { categories } });
};
exports.list = list;
// Create category (admin)
const create = async (req, res) => {
    const category = await (0, category_service_1.createCategory)({
        ...req.body,
        image: req.body?.image || req.body?.imageUrl
    });
    res.status(201).json({ success: true, data: { category } });
};
exports.create = create;
// Update category (admin)
const update = async (req, res) => {
    const category = await (0, category_service_1.updateCategory)((0, request_1.getParam)(req.params, "id"), {
        ...req.body,
        image: req.body?.image || req.body?.imageUrl
    });
    res.status(200).json({ success: true, data: { category } });
};
exports.update = update;
// Delete category (admin)
const remove = async (req, res) => {
    const result = await (0, category_service_1.deleteCategory)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: result });
};
exports.remove = remove;
