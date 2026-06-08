import express from "express";

import authRouter from "./routes/auth.routes.js";
import { responseLogger } from "./middlewares/logger.middleware.js";

const app = express();

app.use(express.json());
app.use(responseLogger);

app.use("/api/auth", authRouter);
export default app;