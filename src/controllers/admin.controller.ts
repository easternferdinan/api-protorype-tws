import type { Request, Response } from "express";

import { adminService } from "../services/admin.service.js";
import { transactionService } from "../services/transaction.service.js";
import { customerService } from "../services/customer.service.js";

export async function login(req: Request, res: Response) {
  const result = await adminService.login(req.body);
  res.json({ success: true, data: result });
}

export async function update(req: Request, res: Response) {
  const result = await adminService.update(req.body);
  res.json({ success: true, data: result });
}

export async function listTransactions(_req: Request, res: Response) {
  const transactions = await transactionService.listAllTransactions();
  res.json({ success: true, transactions });
}

export async function listCustomers(_req: Request, res: Response) {
  const customers = await customerService.listAll();
  res.json({ success: true, customers });
}

export async function createCustomer(req: Request, res: Response) {
  const customer = await customerService.create(req.body);
  res.status(201).json({ success: true, customer });
}

export async function updateCustomer(req: Request, res: Response) {
  const email = req.params.email as string;
  const customer = await customerService.update(email, req.body);
  res.json({ success: true, customer });
}

export async function deleteCustomer(req: Request, res: Response) {
  const email = req.params.email as string;
  await customerService.delete(email);
  res.json({ success: true });
}
