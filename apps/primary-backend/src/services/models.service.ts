import { prisma } from "db";

export const Models = {
    async getModels() {
        const models = await prisma.model.findMany({ 
            include: { company: true },
            orderBy: { id: "asc" } 
        });
        return models.map((model) => ({
            id: model.id.toString(), name: model.name, slug: model.slug,
            company: { id: model.company.id.toString(), name: model.company.name, website: model.company.website },
        }));
    },
    async getProviders() {
        const providers = await prisma.provider.findMany({ orderBy: { id: "asc" } });
        return providers.map((provider) => ({ id: provider.id.toString(), name: provider.name, website: provider.website }));
    },
    async getModelProviders(modelId: number) {
        const mappings = await prisma.modelProviderMapping.findMany({ 
            where: { modelId },
            include: { provider: true },
            orderBy: { id: "asc" } 
        });
        return mappings.map((mapping) => ({
            id: mapping.id.toString(), providerId: mapping.provider.id.toString(), providerName: mapping.provider.name,
            providerWebsite: mapping.provider.website, inputTokenCost: mapping.inputTokenCost, outputTokenCost: mapping.outputTokenCost,
        }));
    },
};
