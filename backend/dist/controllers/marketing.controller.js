"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEnabled = exports.update = exports.list = void 0;
const marketing_service_1 = require("../services/marketing.service");
const request_1 = require("../utils/request");
// Admin: list all integrations
const list = async (_req, res) => {
    const integrations = await (0, marketing_service_1.listIntegrations)();
    res.status(200).json({ success: true, data: { integrations } });
};
exports.list = list;
// Admin: update integration settings
const update = async (req, res) => {
    const integration = await (0, marketing_service_1.upsertIntegration)((0, request_1.getParam)(req.params, "provider"), req.body);
    res.status(200).json({ success: true, data: { integration } });
};
exports.update = update;
// Public: list enabled integrations
const listEnabled = async (_req, res) => {
    const integrations = await (0, marketing_service_1.listEnabledIntegrations)();
    res.status(200).json({ success: true, data: { integrations } });
};
exports.listEnabled = listEnabled;
