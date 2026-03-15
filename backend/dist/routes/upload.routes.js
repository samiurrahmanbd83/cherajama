"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const middleware_1 = require("../middleware");
const upload_schemas_1 = require("../validators/upload.schemas");
const router = (0, express_1.Router)();
// Image uploads (Supabase Storage)
router.post("/", middleware_1.productImageUpload.single("file"), (0, middleware_1.validateRequest)(upload_schemas_1.uploadImageSchema), upload_controller_1.uploadImage);
exports.default = router;
