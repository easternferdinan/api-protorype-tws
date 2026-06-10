import { Router } from "express";
import {
  createTransaction,
  getTransactions,
} from "../controllers/transaction.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createTransactionSchema } from "../schemas/transaction.schema.js";

const router = Router();

router.get("/", authenticate, getTransactions);
router.post("/", authenticate, validate(createTransactionSchema), createTransaction);

export default router;
