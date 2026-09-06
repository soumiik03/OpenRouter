import { type Request, type Response } from "express";
import { ModelIdParamsModel } from "../schemas/models.schema";
import { Models } from "../services/models.service";

export async function getModels(_req: Request, res: Response) {
    return res.status(200).json({ models: await Models.getModels() });
}

export async function getProviders(_req: Request, res: Response) {
    return res.status(200).json({ providers: await Models.getProviders() });
}

export async function getModelProviders(req: Request, res: Response) {
    const { id } = ModelIdParamsModel.parse(req.params);
    return res.status(200).json({ providers: await Models.getModelProviders(id) });
}
