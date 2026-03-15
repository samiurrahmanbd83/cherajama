"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuth_controller_1 = require("../controllers/adminAuth.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const adminAuth_schemas_1 = require("../validators/adminAuth.schemas");
const router = (0, express_1.Router)();
router.post("/login", (0, validateRequest_1.validateRequest)(adminAuth_schemas_1.adminLoginSchema), adminAuth_controller_1.login);
exports.default = router;
