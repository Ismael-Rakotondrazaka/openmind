import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { TagSchema } from "~/schemas/globalSchemas/tags";
import {
  ArticleSchema,
  ArticleCountSchema,
} from "~/schemas/globalSchemas/articles";
import { ArticleAuthSchema } from "~/schemas/globalSchemas/articles/articleAuth";
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
      article: ArticleSchema.and(
        z.object({
          user: UserSchema,
        }),
      ).and(
        z
          .object({
            tags: z.array(TagSchema),
          })
          .and(ArticleCountSchema)
          .and(ArticleAuthSchema),
      ),
    }),
  ),
});

export type StoreSavedArticleData = z.infer<typeof StoreSavedArticleDataSchema>;

export type StoreSavedArticleError =
  | BadRequestError<StoreSavedArticleBodyPEM>
  | UnauthorizedError;
