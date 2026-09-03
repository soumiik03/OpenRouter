import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import apiKeyRouter from "./routes/apikey.route";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api-keys", apiKeyRouter);

export default app;
