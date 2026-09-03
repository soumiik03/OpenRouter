import { randomInt } from "node:crypto";
import { prisma } from "db";

export const ApiKeys ={
    createRandomApiKey() {
        const apiKeyLength = 20;
        const alphabet = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let suffix = "";

        for (let index = 0; index < apiKeyLength; index += 1) {
            suffix += alphabet[randomInt(alphabet.length)];
        }

        return `sk-or-v1-${suffix}`;
    },
 
    async createApiKey(name: string, userId: number): Promise<{ id: string; apiKey: string }> {
        const apiKey = ApiKeys.createRandomApiKey();
        const apiKeyDb = await prisma.apiKey.create({
            data:{
                name: name.trim(),
                apiKey,
                userId
            }
        });

        return{
            id: apiKeyDb.id.toString(),
            apiKey
        };

    },

    async getApiKeys(userId: number) {
        const apiKeys = await prisma.apiKey.findMany({
            where:{
                userId,
                deleted: false
            },
            orderBy: { id: "desc" }
        });

        return apiKeys.map((apiKey) => ({
            id: apiKey.id.toString(),
            apiKey: apiKey.apiKey,
            name: apiKey.name,
            credisConsumed: apiKey.creditsConsumed,
            lastUsed: apiKey.lastUsed,
            disabled: apiKey.disabled
        }));
    }
};
