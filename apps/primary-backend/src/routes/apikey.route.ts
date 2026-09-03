import { Router } from "express"; 
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createApiKey, getApiKeys } from "../controllers/apikey.controller";
import { ApiKeyModel } from "../schemas/apikey.schema";

const router = Router();

router.post("/", authMiddleware, validate(ApiKeyModel), createApiKey);

router.get("/", authMiddleware, getApiKeys);

export default router;
