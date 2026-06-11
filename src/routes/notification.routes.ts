import { Router } from "express";
import { sendNotification } from "../controllers/notification.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sendNotificationSchema } from "../schemas/notification.schema.js";

const router = Router();

router.post("/", validate(sendNotificationSchema), sendNotification);

export default router;
