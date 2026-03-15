"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.updateItem = exports.addItem = exports.viewCart = void 0;
const cart_service_1 = require("../services/cart.service");
const request_1 = require("../utils/request");
// View cart
const viewCart = async (req, res) => {
    const userId = req.user.id;
    const cart = await (0, cart_service_1.getCart)(userId);
    res.status(200).json({ success: true, data: { cart } });
};
exports.viewCart = viewCart;
// Add item to cart
const addItem = async (req, res) => {
    const userId = req.user.id;
    const cart = await (0, cart_service_1.addToCart)(userId, req.body);
    res.status(200).json({ success: true, data: { cart } });
};
exports.addItem = addItem;
// Update cart item quantity
const updateItem = async (req, res) => {
    const userId = req.user.id;
    const cart = await (0, cart_service_1.updateCartItem)(userId, (0, request_1.getParam)(req.params, "id"), req.body.quantity);
    res.status(200).json({ success: true, data: { cart } });
};
exports.updateItem = updateItem;
// Remove item from cart
const removeItem = async (req, res) => {
    const userId = req.user.id;
    const cart = await (0, cart_service_1.removeCartItem)(userId, (0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: { cart } });
};
exports.removeItem = removeItem;
