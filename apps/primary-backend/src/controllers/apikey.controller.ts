import { type Request, type Response } from "express";
import { ApiKeys } from "../services/apikey.service";
import { ApiKeyIdParamsModel, ApiKeyModel, UpdateApiKeyModel } from "../schemas/apikey.schema";

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

export async function updateApiKey(req: Request, res: Response) {
    const userId = Number(req.userId);
    const { id, disabled } = UpdateApiKeyModel.parse(req.body);
    const updated = await ApiKeys.updateApiKeyDisabled(id, userId, disabled);

    if (!updated) {
        return res.status(404).json({ message: "API key not found" });
    }

    return res.status(200).json({ message: "API key updated successfully" });
}

export async function deleteApiKey(req: Request, res: Response) {
    const userId = Number(req.userId);
    const { id } = ApiKeyIdParamsModel.parse(req.params);
    const deleted = await ApiKeys.deleteApiKey(id, userId);

    if (!deleted) {
        return res.status(404).json({ message: "API key not found" });
    }

    return res.status(200).json({ message: "API key deleted successfully" });
}
