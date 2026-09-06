import { Router } from "express";
import { onramp } from "../controllers/payments.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.post("/onramp", authMiddleware, onramp);
export default router;
