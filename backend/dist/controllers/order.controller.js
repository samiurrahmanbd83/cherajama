"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.cancel = exports.track = exports.history = exports.create = void 0;
const request_1 = require("../utils/request");
const order_service_1 = require("../services/order.service");
// Create order from cart
const create = async (req, res) => {
    const userId = req.user.id;
    const order = await (0, order_service_1.createOrderFromCart)(userId, req.body);
    res.status(201).json({ success: true, data: { order } });
};
exports.create = create;
// Order history
const history = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const orders = await (0, order_service_1.listOrders)(userId, role);
    res.status(200).json({ success: true, data: { orders } });
};
exports.history = history;
// Order tracking
const track = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const order = await (0, order_service_1.getOrderById)(userId, role, (0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: { order } });
};
exports.track = track;
// Cancel order
const cancel = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const order = await (0, order_service_1.cancelOrder)(userId, role, (0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: { order } });
};
exports.cancel = cancel;
// Admin: update order status
const updateStatus = async (req, res) => {
    const order = await (0, order_service_1.updateOrderStatus)((0, request_1.getParam)(req.params, "id"), req.body.status);
    res.status(200).json({ success: true, data: { order } });
};
exports.updateStatus = updateStatus;
