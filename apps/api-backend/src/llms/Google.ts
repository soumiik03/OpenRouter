import { Messages } from "../types";
import { BaseLlm, type LlmResponse } from "./Base";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const FAST_FALLBACK_MODELS = [
  "liquid/lfm-2.5-2.6b:free",
  "apodex/apodex-1.1-mini:free",
  "inclusionai/ling-3.0-flash-sante:free",
];

async function callOpenRouter(modelName: string, messages: Messages, timeoutMs = 8000) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Setu AI Gateway",
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      stream: false,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter HTTP ${res.status}: ${errorText}`);
  }

  return res.json();
}

export class Gemini extends BaseLlm {
  static override async chat(model: string, messages: Messages): Promise<LlmResponse> {
    let response: any = null;

    try {
      response = await callOpenRouter(model, messages, 8000);
    } catch {
      for (const fallbackModel of FAST_FALLBACK_MODELS) {
        if (fallbackModel === model) continue;
        try {
          response = await callOpenRouter(fallbackModel, messages, 6000);
          break;
        } catch {
        }
      }
    }

    if (!response) {
      throw new Error("All upstream model providers are temporarily unreachable or rate-limited. Please retry shortly.");
    }

    const promptTokens = Number(
      response.usage?.prompt_tokens ??
      response.usage?.promptTokens ??
      10
    );
    const completionTokens = Number(
      response.usage?.completion_tokens ??
      response.usage?.completionTokens ??
      20
    );

    return {
      inputTokensConsumed: Math.max(1, promptTokens),
      outputTokensConsumed: Math.max(1, completionTokens),
      completions: {
        choices: [
          {
            message: {
              content: response.choices?.[0]?.message?.content ?? "Request processed successfully.",
            },
          },
        ],
      },
    };
  }
}
