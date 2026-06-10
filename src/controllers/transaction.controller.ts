import type { NextFunction, Request, Response } from "express";
import { transactionService } from "../services/transaction.service.js";

export async function getTransactions(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const uid = req.uid;
  if (!uid) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const transactions = await transactionService.list(uid);
  res.json({ success: true, transactions });
}

export async function createTransaction(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const uid = req.uid;
  if (!uid) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { layanan } = req.body;
  const transaction = await transactionService.create(uid, layanan);
  res.status(201).json({ success: true, transaction });
}
