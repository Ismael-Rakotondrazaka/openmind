import { z } from "zod";
import { ArticleFullSchema } from "~/schemas/globalSchemas/articles";

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
  article: ArticleFullSchema,
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
