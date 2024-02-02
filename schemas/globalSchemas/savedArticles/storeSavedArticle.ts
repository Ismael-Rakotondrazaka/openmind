import { z } from "zod";
import { SavedArticleFullSchema } from "~/schemas/globalSchemas/savedArticles/savedArticleFull";

export const StoreSavedArticleBodySchema = z.object({
  articleId: z.string(),
});

export type StoreSavedArticleBody = z.infer<typeof StoreSavedArticleBodySchema>;

export type StoreSavedArticleBodyPEM =
  RequestErrorMessage<StoreSavedArticleBody>;

export const StoreSavedArticleDataSchema = z.object({
  savedArticle: SavedArticleFullSchema,
});

export type StoreSavedArticleData = z.infer<typeof StoreSavedArticleDataSchema>;

export type StoreSavedArticleError =
  | BadRequestError<StoreSavedArticleBodyPEM>
  | UnauthorizedError;
