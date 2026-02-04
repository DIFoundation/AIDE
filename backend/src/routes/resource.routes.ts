import { Router } from "express";
import {
  fetchResources,
  fetchResourceById,
  searchResourcesByLocation,
  addResource,
  updateResource,
  verifyResource,
  deleteResource,
} from "../controllers/resource.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import {
  createResourceSchema,
  updateResourceSchema,
  resourceQuerySchema,
  locationQuerySchema,
} from "../validation/schemas";

const router = Router();

// Public routes
router.get("/", validateQuery(resourceQuerySchema), fetchResources);
router.get(
  "/search",
  validateQuery(locationQuerySchema),
  searchResourcesByLocation
);
router.get("/:id", fetchResourceById);

// Protected routes - authenticated users can create
router.post(
  "/",
  authenticate,
  validateBody(createResourceSchema),
  addResource
);

// Admin/Volunteer routes
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  validateBody(updateResourceSchema),
  updateResource
);

router.patch(
  "/:id/verify",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  verifyResource
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  deleteResource
);

export default router;