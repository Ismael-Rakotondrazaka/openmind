import { z } from "zod";
import {
  SavedArticleSchema,
  ArticleSchema,
  UserSchema,
  TagSchema,
} from "~/utils/schemas";

export const StoreSavedArticleBodySchema = z.object({
  articleId: z.string(),
});

export type StoreSavedArticleBody = z.infer<typeof StoreSavedArticleBodySchema>;

export type StoreSavedArticleBodyPEM =
  RequestErrorMessage<StoreSavedArticleBody>;

export const StoreSavedArticleDataSchema = z.object({
  savedArticle: SavedArticleSchema.and(
    z.object({
      article: ArticleSchema.and(
        z.object({
          user: UserSchema,
        }),
      ).and(
        z.object({
          tags: z.array(TagSchema),
        }),
      ),
    }),
  ),
});

export type StoreSavedArticleData = z.infer<typeof StoreSavedArticleDataSchema>;

export type StoreSavedArticleError =
  | BadRequestError<StoreSavedArticleBodyPEM>
  | UnauthorizedError;
