import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "db";
import { Conversation } from "./types";
import { Gemini } from "./llms/Google";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/v1/chat/completions", async (req, res) => {
  const auth =
    req.headers.authorization || (req.headers["x-api-key"] as string) || "";
  const apiKey = auth.replace(/^Bearer\s+/i, "").trim();

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

  const modelDb = await prisma.model.findFirst({
    where: { slug: model },
    include: { modelProviderMappings: { include: { provider: true } } },
  });

  if (!modelDb)
    return res
      .status(403)
      .json({ message: "This is an invalid model we dont support" });

  const providers = modelDb.modelProviderMappings;
  if (!providers.length)
    return res
      .status(403)
      .json({ message: "No provider found for this model" });

  const provider = providers[Math.floor(Math.random() * providers.length)]!;

  let response;
  try {
    response = await Gemini.chat(model, messages);
  } catch (err: any) {
    return res.status(502).json({ message: err.message || "Provider error" });
  }

  const creditsUsed = Math.ceil(
    (response.inputTokensConsumed * provider.inputTokenCost +
      response.outputTokensConsumed * provider.outputTokenCost) /
      10,
  );

  await prisma.user.update({
    where: { id: apiKeyDb.user.id },
    data: { credits: { decrement: creditsUsed } },
  });

  await prisma.apiKey.update({
    where: { id: apiKeyDb.id },
    data: { creditsConsumed: { increment: creditsUsed } },
  });

  return res.json(response);
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on port 4000");
});

export default app;
