"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSection = exports.updateSection = exports.createSection = exports.listSections = void 0;
const request_1 = require("../utils/request");
const homepageSections_service_1 = require("../services/homepageSections.service");
// Public: list homepage sections
const listSections = async (_req, res) => {
    const sections = await (0, homepageSections_service_1.listHomepageSections)();
    res.status(200).json({ success: true, data: { sections } });
};
exports.listSections = listSections;
// Admin: create section
const createSection = async (req, res) => {
    const section = await (0, homepageSections_service_1.createHomepageSection)(req.body);
    res.status(201).json({ success: true, data: { section } });
};
exports.createSection = createSection;
// Admin: update section
const updateSection = async (req, res) => {
    const section = await (0, homepageSections_service_1.updateHomepageSection)((0, request_1.getParam)(req.params, "id"), req.body);
    res.status(200).json({ success: true, data: { section } });
};
exports.updateSection = updateSection;
// Admin: delete section
const deleteSection = async (req, res) => {
    const result = await (0, homepageSections_service_1.deleteHomepageSection)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: result });
};
exports.deleteSection = deleteSection;
