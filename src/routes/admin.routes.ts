import { Router } from "express";
import { login, update } from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, updateAdminSchema } from "../schemas/admin.schema.js";

const router = Router();

router.post("/auth", validate(loginSchema), login);
router.put("/auth", validate(updateAdminSchema), update);

export default router;
