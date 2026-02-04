import { Router } from "express";
import {
  fetchCurrentUser,
  fetchAllUsers,
  updateUser,
  updateUserRole,
  verifyUser,
  fetchUserStats,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { updateUserSchema, updateUserRoleSchema } from "../validation/schemas";

const router = Router();

// User routes - requires authentication
router.get("/me", authenticate, fetchCurrentUser);
router.put("/me", authenticate, validateBody(updateUserSchema), updateUser);

// Admin routes
router.get("/", authenticate, authorize(["ADMIN"]), fetchAllUsers);
router.get("/stats", authenticate, authorize(["ADMIN"]), fetchUserStats);
router.patch(
  "/:id/role",
  authenticate,
  authorize(["ADMIN"]),
  validateBody(updateUserRoleSchema),
  updateUserRole
);
router.patch("/:id/verify", authenticate, authorize(["ADMIN"]), verifyUser);

export default router;