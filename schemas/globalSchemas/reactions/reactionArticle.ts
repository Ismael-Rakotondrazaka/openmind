import { z } from "zod";

export const ReactionArticleSchema = ReactionBaseSchema.merge(
  z.object({
    articleId: z.string(),
    commentId: z.null(),
  }),
);
export type ReactionArticle = z.infer<typeof ReactionArticleSchema>;
