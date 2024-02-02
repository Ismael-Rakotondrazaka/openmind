import { z } from "zod";

export const SavedArticleSchema = z.object({
  articleId: z.string(),
  userId: z.number().int(),
  createdAt: z.coerce.date(),
});

export type SavedArticle = z.infer<typeof SavedArticleSchema>;
