"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = exports.summary = void 0;
const checkout_service_1 = require("../services/checkout.service");
// Return checkout summary for current cart
const summary = async (req, res) => {
    const userId = req.user.id;
    const data = await (0, checkout_service_1.getCheckoutSummary)(userId);
    res.status(200).json({ success: true, data });
};
exports.summary = summary;
// Create order from current cart
const placeOrder = async (req, res) => {
    const userId = req.user.id;
    const order = await (0, checkout_service_1.checkout)(userId, req.body);
    res.status(201).json({ success: true, data: { order } });
};
exports.placeOrder = placeOrder;
