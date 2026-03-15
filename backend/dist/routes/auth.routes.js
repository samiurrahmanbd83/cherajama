"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const middleware_1 = require("../middleware");
const validateRequest_1 = require("../middleware/validateRequest");
const auth_schemas_1 = require("../validators/auth.schemas");
// Authentication routes
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(auth_schemas_1.registerSchema), auth_controller_1.register);
router.post("/login", (0, validateRequest_1.validateRequest)(auth_schemas_1.loginSchema), auth_controller_1.login);
router.get("/profile", middleware_1.authenticate, auth_controller_1.profile);
router.put("/profile", middleware_1.authenticate, (0, validateRequest_1.validateRequest)(auth_schemas_1.updateProfileSchema), auth_controller_1.updateProfileHandler);
exports.default = router;
