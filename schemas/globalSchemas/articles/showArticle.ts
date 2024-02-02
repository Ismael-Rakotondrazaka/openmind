import { z } from "zod";
import { ArticleFullSchema } from "~/schemas/globalSchemas/articles";

/* -------------------------------------------------------------------------- */
/*                             Show article param                             */
/* -------------------------------------------------------------------------- */

export const ShowArticleParamSchema = z.object({
  slug: z.string().trim(),
});

export type ShowArticleParam = z.infer<typeof ShowArticleParamSchema>;

/* -------------------------------------------------------------------------- */
/*                              Show article data                             */
/* -------------------------------------------------------------------------- */

export const ShowArticleDataSchema = z.object({
  article: ArticleFullSchema,
});

export type ShowArticleData = z.infer<typeof ShowArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Show article error                             */
/* -------------------------------------------------------------------------- */

export type ShowArticleError = NotFoundError;
