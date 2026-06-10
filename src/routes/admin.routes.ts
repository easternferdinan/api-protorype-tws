import { Router } from "express";
import {
  login,
  update,
  listTransactions,
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, updateAdminSchema } from "../schemas/admin.schema.js";
import { createCustomerSchema } from "../schemas/customer.schema.js";

const router = Router();

router.post("/auth", validate(loginSchema), login);
router.put("/auth", validate(updateAdminSchema), update);

// TODO: add admin auth middleware
router.get("/transactions", listTransactions);

// TODO: add admin auth middleware
router.get("/customers", listCustomers);
router.post("/customers", validate(createCustomerSchema), createCustomer);
router.put("/customers/:email", updateCustomer);
router.delete("/customers/:email", deleteCustomer);

export default router;
