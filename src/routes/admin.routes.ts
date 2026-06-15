import { Router } from "express";
import {
  createCustomer,
  createTransaction,
  deleteCustomer,
  deleteTransaction,
  listCustomers,
  listTransactions,
  login,
  update,
  updateCustomer,
  updateFcmToken,
  updateTransaction,
  viewProof,
} from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  fcmTokenSchema,
  loginSchema,
  updateAdminSchema,
} from "../schemas/admin.schema.js";
import { createCustomerSchema } from "../schemas/customer.schema.js";
import {
  adminCreateTransactionSchema,
  adminUpdateTransactionSchema,
} from "../schemas/transaction.schema.js";

const router = Router();

router.post("/auth", validate(loginSchema), login);
router.put("/auth", validate(updateAdminSchema), update);

// TODO: add admin auth middleware
router.get("/transactions", listTransactions);
router.post(
  "/transactions",
  validate(adminCreateTransactionSchema),
  createTransaction,
);
router.put(
  "/transactions/:id",
  validate(adminUpdateTransactionSchema),
  updateTransaction,
);
router.delete("/transactions/:id", deleteTransaction);
router.get("/proof/:transactionId", viewProof);

// TODO: add admin auth middleware
router.put("/fcm-token", validate(fcmTokenSchema), updateFcmToken);
router.get("/customers", listCustomers);
router.post("/customers", validate(createCustomerSchema), createCustomer);
router.put("/customers/:email", updateCustomer);
router.delete("/customers/:email", deleteCustomer);

export default router;
