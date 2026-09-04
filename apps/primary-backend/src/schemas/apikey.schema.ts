import { z } from "zod";

export const ApiKeyModel = z.object({
    name: z.string().trim().min(1).max(100),
});

export const UpdateApiKeyModel = z.object({
    id: z.coerce.number().int().positive(),
    disabled: z.boolean(),
});

export const ApiKeyIdParamsModel = z.object({
    id: z.coerce.number().int().positive(),
});
