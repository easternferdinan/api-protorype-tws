import { Router } from "express";
import {
  getProfile,
  updatePassword,
  updateProfile,
  updateFcmToken,
} from "../controllers/customer.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  updateCustomerSchema,
  updatePasswordSchema,
  updateFcmTokenSchema,
} from "../schemas/customer.schema.js";

const router = Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, validate(updateCustomerSchema), updateProfile);
router.put(
  "/me/password",
  authenticate,
  validate(updatePasswordSchema),
  updatePassword,
);
router.put(
  "/me/fcm-token",
  authenticate,
  validate(updateFcmTokenSchema),
  updateFcmToken,
);

export default router;
