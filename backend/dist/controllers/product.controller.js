"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.search = exports.getBySlug = exports.list = void 0;
const request_1 = require("../utils/request");
const product_service_1 = require("../services/product.service");
// List products (public)
const list = async (_req, res) => {
    const products = await (0, product_service_1.listProducts)();
    res.status(200).json({ success: true, data: { products } });
};
exports.list = list;
// Get product details by slug (public)
const getBySlug = async (req, res) => {
    const product = await (0, product_service_1.getProductBySlug)((0, request_1.getParam)(req.params, "slug"));
    res.status(200).json({ success: true, data: { product } });
};
exports.getBySlug = getBySlug;
// Search products with filters (public)
const search = async (req, res) => {
    const products = await (0, product_service_1.searchProducts)(req.query);
    res.status(200).json({ success: true, data: { products } });
};
exports.search = search;
// Create product (admin)
const create = async (req, res) => {
    const product = await (0, product_service_1.createProduct)({
        ...req.body,
        files: req.files
    });
    res.status(201).json({ success: true, data: { product } });
};
exports.create = create;
// Update product (admin)
const update = async (req, res) => {
    const product = await (0, product_service_1.updateProduct)((0, request_1.getParam)(req.params, "id"), {
        ...req.body,
        files: req.files
    });
    res.status(200).json({ success: true, data: { product } });
};
exports.update = update;
// Delete product (admin)
const remove = async (req, res) => {
    const result = await (0, product_service_1.deleteProduct)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: result });
};
exports.remove = remove;
