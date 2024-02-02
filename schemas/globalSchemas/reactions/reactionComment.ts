import { z } from "zod";
import { ReactionBaseSchema } from "~/schemas/globalSchemas/reactions/reactionBase";

export const ReactionCommentSchema = ReactionBaseSchema.merge(
  z.object({
    commentId: z.string(),
    articleId: z.null(),
  }),
);
export type ReactionComment = z.infer<typeof ReactionCommentSchema>;
