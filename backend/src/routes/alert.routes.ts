import { Router } from "express";
import {
  fetchAlerts,
  fetchActiveAlerts,
  fetchAlertById,
  fetchAlertsForLocation,
  createAlert,
  updateAlert,
  deactivateAlert,
  deleteAlert,
} from "../controllers/alert.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { 
  createAlertSchema, 
  updateAlertSchema,
  locationQuerySchema 
} from "../validation/schemas";

const router = Router();

// Public routes
router.get("/", fetchAlerts);
router.get("/active", fetchActiveAlerts);
router.get("/:id", fetchAlertById);
router.get(
  "/location/check", 
  validateQuery(locationQuerySchema), 
  fetchAlertsForLocation
);

// Protected routes - Admin and Volunteer
router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  validateBody(createAlertSchema),
  createAlert
);

router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  validateBody(updateAlertSchema),
  updateAlert
);

router.patch(
  "/:id/deactivate",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  deactivateAlert
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  deleteAlert
);

export default router;