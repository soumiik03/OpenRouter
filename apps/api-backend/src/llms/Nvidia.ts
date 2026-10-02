import { OpenRouter } from "@openrouter/sdk";
import { Messages } from "../types";
import { BaseLlm, type LlmResponse } from "./Base";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export class Nvidia extends BaseLlm {
  static override async chat(model: string, messages: Messages): Promise<LlmResponse> {
    const response = (await openrouter.chat.send({
      chatRequest: {
        model,
        messages,
        stream: false,
      },
    })) as any;

    return {
      inputTokensConsumed: response.usage?.promptTokens ?? 0,
      outputTokensConsumed: response.usage?.completionTokens ?? 0,
      completions: {
        choices: [
          {
            message: {
              content: response.choices?.[0]?.message?.content ?? "",
            },
          },
        ],
      },
    };
  }
}
