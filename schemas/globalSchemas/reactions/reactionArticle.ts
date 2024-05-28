import { z } from "zod";
import { ReactionBaseSchema } from "~/schemas/globalSchemas/reactions/reactionBase";

export const ReactionArticleSchema = ReactionBaseSchema.merge(
  z.object({
    articleId: z.string(),
    commentId: z.null(),
  }),
);
export type ReactionArticle = z.infer<typeof ReactionArticleSchema>;
