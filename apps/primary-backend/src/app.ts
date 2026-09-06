import express from "express";
import { type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import apiKeyRouter from "./routes/apikey.route";
import modelsRouter from "./routes/models.route";
import paymentsRouter from "./routes/payments.route";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api-keys", apiKeyRouter);
app.use("/models", modelsRouter);
app.use("/payments", paymentsRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
});

export default app;
