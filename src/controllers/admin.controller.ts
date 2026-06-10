import type { Request, Response } from "express";

import { adminService } from "../services/admin.service.js";

export async function login(req: Request, res: Response) {
  const result = await adminService.login(req.body);
  res.json({ success: true, data: result });
}

export async function update(req: Request, res: Response) {
  const result = await adminService.update(req.body);
  res.json({ success: true, data: result });
}
