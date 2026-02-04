import { Router } from "express";
import {
  getDashboardStats,
  getResourceTypeDistribution,
} from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Admin dashboard routes
router.get(
  "/stats",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  getDashboardStats
);

router.get(
  "/resources/distribution",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  getResourceTypeDistribution
);

export default router;