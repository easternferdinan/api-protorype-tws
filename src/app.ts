import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import { responseLogger } from "./middlewares/logger.middleware.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(responseLogger);

app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;
