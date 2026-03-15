import { Router } from "express";
import { list, remove, updateRole } from "../controllers/adminUsers.controller";
import { validateRequest } from "../middleware/validateRequest";
import {
  adminUserDeleteSchema,
  adminUserRoleSchema,
  adminUsersListSchema
} from "../validators/adminUsers.schemas";

const router = Router();

router.get("/", validateRequest(adminUsersListSchema), list);
router.put("/:id/role", validateRequest(adminUserRoleSchema), updateRole);
router.delete("/:id", validateRequest(adminUserDeleteSchema), remove);

export default router;
