import { z } from "zod";
import { ReactionSchema } from "~/schemas/globalSchemas/reactions/reaction";

export const CommentAuthSchema = z.object({
  _auth: z.object({
    reaction: ReactionSchema.nullable(),
  }),
});

export type CommentAuth = z.infer<typeof CommentAuthSchema>;
