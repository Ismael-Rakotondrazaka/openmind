import { z } from "zod";
import {
  ArticleSchema,
  TagSchema,
  UserSchema,
  ArticleCountSchema,
  ArticleAuthSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                         Destroy saved article param                        */
/* -------------------------------------------------------------------------- */

export const DestroySavedArticleParamSchema = z.object({
  articleId: z.string().trim(),
});

export type DestroySavedArticleParam = z.infer<
  typeof DestroySavedArticleParamSchema
>;

/* -------------------------------------------------------------------------- */
/*                         Destroy saved article data                         */
/* -------------------------------------------------------------------------- */

export const DestroySavedArticleDataSchema = z.object({
  article: ArticleSchema.and(
    z.object({
      user: UserSchema,
    }),
  )
    .and(
      z.object({
        tags: z.array(TagSchema),
      }),
    )
    .and(ArticleCountSchema)
    .and(ArticleAuthSchema),
});

export type DestroySavedArticleData = z.infer<
  typeof DestroySavedArticleDataSchema
>;

/* -------------------------------------------------------------------------- */
/*                         Destroy saved article error                        */
/* -------------------------------------------------------------------------- */

export type DestroySavedArticleError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
