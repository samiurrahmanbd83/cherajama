"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analytics = exports.updateDispute = exports.listDisputesAdmin = exports.dispute = exports.reject = exports.approve = exports.riskReport = exports.logs = exports.pending = exports.listAll = exports.submit = void 0;
const request_1 = require("../utils/request");
const payment_service_1 = require("../services/payment.service");
// Customer submits payment details
const submit = async (req, res) => {
    const userId = req.user.id;
    const result = await (0, payment_service_1.submitPayment)(userId, req.body);
    res.status(200).json({ success: true, data: { payment: result } });
};
exports.submit = submit;
// Admin views all payments
const listAll = async (req, res) => {
    const payments = await (0, payment_service_1.listPayments)(req.query);
    res.status(200).json({ success: true, data: { payments } });
};
exports.listAll = listAll;
// Admin views pending payments
const pending = async (_req, res) => {
    const payments = await (0, payment_service_1.listPendingPayments)();
    res.status(200).json({ success: true, data: { payments } });
};
exports.pending = pending;
// Admin views payment logs
const logs = async (req, res) => {
    const records = await (0, payment_service_1.listPaymentLogs)(req.query.order_id);
    res.status(200).json({ success: true, data: { logs: records } });
};
exports.logs = logs;
// Admin risk report
const riskReport = async (req, res) => {
    const payments = await (0, payment_service_1.getRiskReport)(req.query.level);
    res.status(200).json({ success: true, data: { payments } });
};
exports.riskReport = riskReport;
// Admin approves payment
const approve = async (req, res) => {
    const payment = await (0, payment_service_1.verifyPayment)((0, request_1.getParam)(req.params, "order_id"));
    res.status(200).json({ success: true, data: { payment } });
};
exports.approve = approve;
// Admin rejects payment
const reject = async (req, res) => {
    const payment = await (0, payment_service_1.rejectPayment)((0, request_1.getParam)(req.params, "order_id"));
    res.status(200).json({ success: true, data: { payment } });
};
exports.reject = reject;
// Customer submits dispute
const dispute = async (req, res) => {
    const userId = req.user.id;
    const record = await (0, payment_service_1.createDispute)(userId, req.body);
    res.status(201).json({ success: true, data: { dispute: record } });
};
exports.dispute = dispute;
// Admin list disputes
const listDisputesAdmin = async (_req, res) => {
    const disputes = await (0, payment_service_1.listDisputes)();
    res.status(200).json({ success: true, data: { disputes } });
};
exports.listDisputesAdmin = listDisputesAdmin;
// Admin update dispute
const updateDispute = async (req, res) => {
    const dispute = await (0, payment_service_1.updateDisputeStatus)((0, request_1.getParam)(req.params, "id"), req.body.status);
    res.status(200).json({ success: true, data: { dispute } });
};
exports.updateDispute = updateDispute;
// Payment analytics
const analytics = async (req, res) => {
    const days = Number(req.query.days || 30);
    const report = await (0, payment_service_1.getPaymentAnalytics)(days);
    res.status(200).json({ success: true, data: { report } });
};
exports.analytics = analytics;
