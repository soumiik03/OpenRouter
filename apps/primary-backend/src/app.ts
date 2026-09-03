import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

export default app;