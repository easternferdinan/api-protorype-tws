import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import { responseLogger } from "./middlewares/logger.middleware.js";
import adminRouter from "./routes/admin.routes.js";
import authRouter from "./routes/auth.routes.js";
import customerRouter from "./routes/customer.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import notificationRouter from "./routes/notification.routes.js";

const app = express();

app.use(express.json());
app.use(responseLogger);

app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/customers", customerRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/admin/notifications", notificationRouter);

app.use(errorHandler);

export default app;
