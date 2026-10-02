import { z } from "zod";

export const Messages = z.array(
  z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string(),
  })
);

export type Messages = z.infer<typeof Messages>;

export const Conversation = z
  .object({
    model: z.string(),
    messages: Messages.optional(),
    message: Messages.optional(),
  })
  .transform((data) => ({
    model: data.model,
    messages: (data.messages ?? data.message ?? []) as Messages,
  }))
  .refine((data) => data.messages.length > 0, {
    message: "Messages array cannot be empty",
  });

export type Conversation = z.infer<typeof Conversation>;
