import { Router } from "express";
import {
  fetchSubmissions,
  fetchPendingSubmissions,
  fetchMySubmissions,
  createSubmission,
  approveSubmission,
  rejectSubmission,
} from "../controllers/submission.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createSubmissionSchema } from "../validation/schemas";

const router = Router();

// Protected routes - requires authentication
router.get("/my-submissions", authenticate, fetchMySubmissions);
router.post(
  "/",
  authenticate,
  validateBody(createSubmissionSchema),
  createSubmission
);

// Admin/Volunteer routes
router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  fetchSubmissions
);

router.get(
  "/pending",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  fetchPendingSubmissions
);

router.patch(
  "/:id/approve",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  approveSubmission
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize(["ADMIN", "VOLUNTEER"]),
  rejectSubmission
);

export default router;