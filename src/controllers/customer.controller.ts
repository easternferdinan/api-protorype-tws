import type { NextFunction, Request, Response } from "express";
import { customerService } from "../services/customer.service.js";

export async function getProfile(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const uid = req.uid;
  if (!uid) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const customer = await customerService.getProfile(uid);
  res.json({ customer });
}

export async function updateProfile(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const uid = req.uid;
  if (!uid) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const customer = await customerService.updateProfile(uid, req.body);
  res.json({ customer });
}

export async function updateFcmToken(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const uid = req.uid;
  if (!uid) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  await customerService.updateFcmToken(uid, req.body.fcmToken);
  res.json({ success: true });
}

export async function updatePassword(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const uid = req.uid;
  if (!uid) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  await customerService.updatePassword(uid, req.body);
  res.json({ success: true, message: "Password updated successfully" });
}
