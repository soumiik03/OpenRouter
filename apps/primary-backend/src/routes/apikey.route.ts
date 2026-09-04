import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate, validateParams } from "../middlewares/validate.middleware";
import { createApiKey, deleteApiKey, getApiKeys, updateApiKey } from "../controllers/apikey.controller";
import { ApiKeyIdParamsModel, ApiKeyModel, UpdateApiKeyModel } from "../schemas/apikey.schema";

const router = Router();

router.post("/", authMiddleware, validate(ApiKeyModel), createApiKey);

router.get("/", authMiddleware, getApiKeys);

router.put("/", authMiddleware, validate(UpdateApiKeyModel), updateApiKey);

router.delete("/:id", authMiddleware, validateParams(ApiKeyIdParamsModel), deleteApiKey);

export default router;
