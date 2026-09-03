import { type Request, type Response } from "express";
import { ApiKeys } from "../services/apikey.service";
import { ApiKeyModel } from "../schemas/apikey.schema";

export async function createApiKey(req: Request, res: Response) {
    const userId = Number(req.userId);
    const { name } = ApiKeyModel.parse(req.body);
    const apiKey = await ApiKeys.createApiKey(name, userId);

    return res.status(201).json(apiKey);
}

export async function getApiKeys(req: Request, res: Response) {
    const userId = Number(req.userId);
    const apiKeys = await ApiKeys.getApiKeys(userId);

    return res.status(200).json({ apiKeys });
}

