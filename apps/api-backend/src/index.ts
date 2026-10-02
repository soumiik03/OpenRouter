import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "db";
import { Conversation } from "./types";
import { Gemini } from "./llms/Google";

const app = express();
app.use(cors());
app.use(express.json());

let cachedModelMap: { data: any[]; expiry: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

async function getCachedModel(targetModel: string) {
  const now = Date.now();
  if (cachedModelMap && cachedModelMap.expiry > now) {
    const found = cachedModelMap.data.find(
      (m: any) =>
        m.slug === targetModel ||
        m.slug === `${targetModel}:free` ||
        m.slug === targetModel.replace(/:free$/, "")
    );
    if (found) return found;
    return cachedModelMap.data[0] || null;
  }

  const allModels = await prisma.model.findMany({
    where: { modelProviderMappings: { some: {} } },
    include: { modelProviderMappings: { include: { provider: true } } },
  });

  cachedModelMap = {
    data: allModels,
    expiry: now + CACHE_TTL_MS,
  };

  const found = allModels.find(
    (m: any) =>
      m.slug === targetModel ||
      m.slug === `${targetModel}:free` ||
      m.slug === targetModel.replace(/:free$/, "")
  );
  return found || allModels[0] || null;
}

app.post("/api/v1/chat/completions", async (req, res) => {
  const auth = req.headers.authorization || (req.headers["x-api-key"] as string) || "";
  const apiKey = auth.replace(/^Bearer\s+/i, "").trim();

  if (!apiKey) {
    return res.status(401).json({ message: "Missing API key in Authorization header" });
  }

  const apiKeyDb = await prisma.apiKey.findFirst({
    where: { apiKey, disabled: false, deleted: false },
    select: { id: true, user: true },
  });

  if (!apiKeyDb) return res.status(403).json({ message: "Invalid api key" });
  if (apiKeyDb.user.credits <= 0) {
    return res
      .status(403)
      .json({ message: "You dont have enough credits in your db" });
  }

  const parsed = Conversation.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid request body" });

  const { model, messages } = parsed.data;

  const modelDb = await getCachedModel(model);

  if (!modelDb)
    return res
      .status(404)
      .json({ message: "No model or provider available" });

  const providers = modelDb.modelProviderMappings;
  if (!providers || !providers.length)
    return res
      .status(403)
      .json({ message: "No provider found for this model" });

  const provider = providers[Math.floor(Math.random() * providers.length)]!;
  const targetModelSlug = modelDb.slug;

  let response;
  try {
    response = await Gemini.chat(targetModelSlug, messages);
  } catch (err: any) {
    return res.status(502).json({ message: err.message || "Provider error" });
  }

  const inCost = (provider.inputTokenCost && provider.inputTokenCost > 0) ? provider.inputTokenCost : 1;
  const outCost = (provider.outputTokenCost && provider.outputTokenCost > 0) ? provider.outputTokenCost : 2;

  const rawCredits = Math.ceil(
    (response.inputTokensConsumed * inCost +
      response.outputTokensConsumed * outCost) /
      10,
  );
  const creditsUsed = Math.max(1, rawCredits);

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: apiKeyDb.user.id },
      data: { credits: { decrement: creditsUsed } },
      select: { credits: true },
    }),
    prisma.apiKey.update({
      where: { id: apiKeyDb.id },
      data: { 
        creditsConsumed: { increment: creditsUsed },
        lastUsed: new Date(),
      },
    }),
  ]);

  prisma.conversation.create({
    data: {
      userId: apiKeyDb.user.id,
      apiKeyId: apiKeyDb.id,
      modelProviderMappingId: provider.id,
      input: JSON.stringify(messages),
      output: response.completions?.choices?.[0]?.message?.content || "",
      inputTokenCount: response.inputTokensConsumed,
      outputTokenCount: response.outputTokensConsumed,
    },
  }).catch((convErr) => {
    console.error("Conversation log warning:", convErr);
  });

  return res.json({
    id: `chatcmpl-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: response.completions?.choices?.[0]?.message?.content ?? "",
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: response.inputTokensConsumed,
      completion_tokens: response.outputTokensConsumed,
      total_tokens: response.inputTokensConsumed + response.outputTokensConsumed,
    },
    credits_used: creditsUsed,
    remaining_credits: updatedUser.credits,
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on port 4000");
});

export default app;
