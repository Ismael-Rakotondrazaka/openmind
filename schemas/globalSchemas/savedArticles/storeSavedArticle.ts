import { z } from "zod";
import { ArticleFullSchema } from "~/schemas/globalSchemas/articles";
import { SavedArticleSchema } from "~/schemas/globalSchemas/savedArticles";

export const StoreSavedArticleBodySchema = z.object({
  articleId: z.string(),
});

export type StoreSavedArticleBody = z.infer<typeof StoreSavedArticleBodySchema>;

export type StoreSavedArticleBodyPEM =
  RequestErrorMessage<StoreSavedArticleBody>;

export const StoreSavedArticleDataSchema = z.object({
  savedArticle: SavedArticleSchema.and(
    z.object({
      article: ArticleFullSchema,
    }),
  ),
});

export type StoreSavedArticleData = z.infer<typeof StoreSavedArticleDataSchema>;

export type StoreSavedArticleError =
  | BadRequestError<StoreSavedArticleBodyPEM>
  | UnauthorizedError;
