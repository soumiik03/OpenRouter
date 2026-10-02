import { type Messages } from "../types";

export type LlmResponse = {
  completions: {
    choices: {
      message: {
        content: string;
      };
    }[];
  };
  inputTokensConsumed: number;
  outputTokensConsumed: number;
};

export class BaseLlm {
  static async chat(_model: string, _messages: Messages): Promise<LlmResponse> {
    throw new Error("Not implemented chat function");
  }
}