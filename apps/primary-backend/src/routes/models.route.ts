import { Router } from "express";
import { getModelProviders, getModels, getProviders } from "../controllers/models.controller";
import { validateParams } from "../middlewares/validate.middleware";
import { ModelIdParamsModel } from "../schemas/models.schema";

const router = Router();

router.get("/", getModels);
router.get("/providers", getProviders);
router.get("/:id/providers", validateParams(ModelIdParamsModel), getModelProviders);

export default router;
