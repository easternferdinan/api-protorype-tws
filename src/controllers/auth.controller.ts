import type { Request, Response } from "express";
import {authService} from "../services/auth.service.js";

export async function login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.json(result);
}

export async function register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.json(result);
}