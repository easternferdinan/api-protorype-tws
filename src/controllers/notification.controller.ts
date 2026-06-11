import type { Request, Response } from "express";
import { notificationService } from "../services/notification.service.js";

export async function sendNotification(req: Request, res: Response) {
  await notificationService.send(req.body);
  res.json({ success: true });
}
