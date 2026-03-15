"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.list = exports.create = void 0;
const coupon_service_1 = require("../services/coupon.service");
const request_1 = require("../utils/request");
// Create coupon (admin)
const create = async (req, res) => {
    const coupon = await (0, coupon_service_1.createCoupon)(req.body);
    res.status(201).json({ success: true, data: { coupon } });
};
exports.create = create;
// List coupons (admin)
const list = async (_req, res) => {
    const coupons = await (0, coupon_service_1.listCoupons)();
    res.status(200).json({ success: true, data: { coupons } });
};
exports.list = list;
// Update coupon (admin)
const update = async (req, res) => {
    const coupon = await (0, coupon_service_1.updateCoupon)((0, request_1.getParam)(req.params, "id"), req.body);
    res.status(200).json({ success: true, data: { coupon } });
};
exports.update = update;
// Delete coupon (admin)
const remove = async (req, res) => {
    const result = await (0, coupon_service_1.deleteCoupon)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: result });
};
exports.remove = remove;
