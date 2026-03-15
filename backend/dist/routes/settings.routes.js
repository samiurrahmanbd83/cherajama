"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("../controllers/settings.controller");
const middleware_1 = require("../middleware");
const validateRequest_1 = require("../middleware/validateRequest");
const settings_schemas_1 = require("../validators/settings.schemas");
const router = (0, express_1.Router)();
router.get("/", settings_controller_1.getWebsiteSettings);
router.put("/", ...middleware_1.adminMiddleware, middleware_1.settingsUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 }
]), (0, validateRequest_1.validateRequest)(settings_schemas_1.updateSettingsSchema), settings_controller_1.updateWebsiteSettings);
exports.default = router;
