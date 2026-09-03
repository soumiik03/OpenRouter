import {z} from "zod"

export const ApiKeyModel = z.object({
    name: z.string().trim().min(1).max(100),
});

export const disbaleApiKey = z.object({
    id: z.string(),
});


