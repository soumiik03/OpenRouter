import { Router } from "express";
import { onramp, getTransactions } from "../controllers/payments.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.post("/onramp", authMiddleware, onramp);
router.get("/history", authMiddleware, getTransactions);
export default router;
