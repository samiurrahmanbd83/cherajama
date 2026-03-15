"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topProducts = exports.revenue = exports.sales = exports.overview = void 0;
const analytics_service_1 = require("../services/analytics.service");
// Dashboard overview stats
const overview = async (_req, res) => {
    const stats = await (0, analytics_service_1.getOverviewStats)();
    res.status(200).json({ success: true, data: { stats } });
};
exports.overview = overview;
// Daily sales chart data
const sales = async (req, res) => {
    const days = Number(req.query.days || 30);
    const series = await (0, analytics_service_1.getSalesSeries)(days);
    res.status(200).json({ success: true, data: { series } });
};
exports.sales = sales;
// Monthly revenue chart data
const revenue = async (req, res) => {
    const months = Number(req.query.months || 12);
    const series = await (0, analytics_service_1.getRevenueSeries)(months);
    res.status(200).json({ success: true, data: { series } });
};
exports.revenue = revenue;
// Top products by revenue
const topProducts = async (req, res) => {
    const limit = Number(req.query.limit || 5);
    const products = await (0, analytics_service_1.getTopProducts)(limit);
    res.status(200).json({ success: true, data: { products } });
};
exports.topProducts = topProducts;
