import { z } from "zod";
import {
  ArticleSchema,
  TagSchema,
  UserSchema,
  ArticleCountSchema,
  ArticleAuthSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                             Show article param                             */
/* -------------------------------------------------------------------------- */

export const showArticleParamSchema = z.object({
  slug: z.string().trim(),
});

export type ShowArticleParam = z.infer<typeof showArticleParamSchema>;

/* -------------------------------------------------------------------------- */
/*                              Show article data                             */
/* -------------------------------------------------------------------------- */

export const ShowArticleDataSchema = z.object({
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

export type ShowArticleData = z.infer<typeof ShowArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Show article error                             */
/* -------------------------------------------------------------------------- */

export type ShowArticleError = NotFoundError;
