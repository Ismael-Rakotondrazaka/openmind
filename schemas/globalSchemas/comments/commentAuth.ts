import { z } from "zod";
import { ReactionSchema } from "~/schemas/globalSchemas/reactions";

export const CommentAuthSchema = z.object({
  auth: z
    .object({
      reaction: ReactionSchema.nullable(),
    })
    .nullable(),
});

export type CommentAuth = z.infer<typeof CommentAuthSchema>;
