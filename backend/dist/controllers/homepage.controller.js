"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSectionItems = exports.removeSectionItem = exports.updateSectionItem = exports.createSectionItem = exports.listSectionItems = exports.remove = exports.update = exports.create = exports.getById = exports.list = exports.getBySlug = exports.getActive = void 0;
const homepage_service_1 = require("../services/homepage.service");
const homepageSections_service_1 = require("../services/homepageSections.service");
const request_1 = require("../utils/request");
// Public: get active homepage
const getActive = async (_req, res) => {
    const homepage = await (0, homepage_service_1.getActiveHomepage)();
    const sections = await (0, homepageSections_service_1.listHomepageSections)();
    res.status(200).json({ success: true, data: { homepage, sections } });
};
exports.getActive = getActive;
// Public: get homepage by slug
const getBySlug = async (req, res) => {
    const homepage = await (0, homepage_service_1.getHomepageBySlug)((0, request_1.getParam)(req.params, "slug"));
    res.status(200).json({ success: true, data: { homepage } });
};
exports.getBySlug = getBySlug;
// Admin: list homepages
const list = async (_req, res) => {
    const homepages = await (0, homepage_service_1.listHomepages)();
    res.status(200).json({ success: true, data: { homepages } });
};
exports.list = list;
// Admin: get homepage by id
const getById = async (req, res) => {
    const homepage = await (0, homepage_service_1.getHomepageById)((0, request_1.getParam)(req.params, "id"), true);
    res.status(200).json({ success: true, data: { homepage } });
};
exports.getById = getById;
// Admin: create homepage
const create = async (req, res) => {
    const homepage = await (0, homepage_service_1.createHomepage)(req.body);
    res.status(201).json({ success: true, data: { homepage } });
};
exports.create = create;
// Admin: update homepage
const update = async (req, res) => {
    const homepage = await (0, homepage_service_1.updateHomepage)((0, request_1.getParam)(req.params, "id"), req.body);
    res.status(200).json({ success: true, data: { homepage } });
};
exports.update = update;
// Admin: delete homepage
const remove = async (req, res) => {
    const result = await (0, homepage_service_1.deleteHomepage)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: result });
};
exports.remove = remove;
// Admin: list sections
const listSectionItems = async (req, res) => {
    const sections = await (0, homepage_service_1.listSections)((0, request_1.getParam)(req.params, "id"));
    res.status(200).json({ success: true, data: { sections } });
};
exports.listSectionItems = listSectionItems;
// Admin: create section
const createSectionItem = async (req, res) => {
    const section = await (0, homepage_service_1.createSection)((0, request_1.getParam)(req.params, "id"), req.body);
    res.status(201).json({ success: true, data: { section } });
};
exports.createSectionItem = createSectionItem;
// Admin: update section
const updateSectionItem = async (req, res) => {
    const section = await (0, homepage_service_1.updateSection)((0, request_1.getParam)(req.params, "sectionId"), req.body);
    res.status(200).json({ success: true, data: { section } });
};
exports.updateSectionItem = updateSectionItem;
// Admin: delete section
const removeSectionItem = async (req, res) => {
    const result = await (0, homepage_service_1.deleteSection)((0, request_1.getParam)(req.params, "sectionId"));
    res.status(200).json({ success: true, data: result });
};
exports.removeSectionItem = removeSectionItem;
// Admin: reorder sections
const reorderSectionItems = async (req, res) => {
    const result = await (0, homepage_service_1.reorderSections)((0, request_1.getParam)(req.params, "id"), req.body.items);
    res.status(200).json({ success: true, data: result });
};
exports.reorderSectionItems = reorderSectionItems;
