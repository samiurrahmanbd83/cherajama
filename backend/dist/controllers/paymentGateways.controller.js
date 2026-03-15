"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.toggle = exports.list = void 0;
const paymentGateways_service_1 = require("../services/paymentGateways.service");
const request_1 = require("../utils/request");
// List payment gateways
const list = async (_req, res) => {
    const gateways = await (0, paymentGateways_service_1.listGateways)();
    res.status(200).json({ success: true, data: { gateways } });
};
exports.list = list;
// Toggle gateway
const toggle = async (req, res) => {
    const gateway = await (0, paymentGateways_service_1.toggleGateway)((0, request_1.getParam)(req.params, "id"), req.body.is_active);
    res.status(200).json({ success: true, data: { gateway } });
};
exports.toggle = toggle;
// Update gateway settings
const update = async (req, res) => {
    const gateway = await (0, paymentGateways_service_1.updateGateway)((0, request_1.getParam)(req.params, "id"), req.body);
    res.status(200).json({ success: true, data: { gateway } });
};
exports.update = update;
