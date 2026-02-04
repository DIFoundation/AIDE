import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  resetPassword,
  updatePassword,
  getCurrentUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  refreshTokenSchema,
} from "../validation/schemas"; // or "../supabase/validation"

const router = Router();

// Public routes
router.post("/signup", validateBody(signUpSchema), signUp);
router.post("/signin", validateBody(signInSchema), signIn);
router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);
router.post("/refresh", validateBody(refreshTokenSchema), refreshToken);

// Protected routes
router.post("/signout", authenticate, signOut);
router.post("/update-password", authenticate, validateBody(updatePasswordSchema), updatePassword);
router.get("/me", authenticate, getCurrentUser);

export default router;