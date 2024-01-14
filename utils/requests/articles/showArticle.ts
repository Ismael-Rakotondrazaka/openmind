import { z } from "zod";
import { ArticleSchema, TagSchema, UserSchema } from "~/utils/schemas";

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

export const showArticleDataSchema = z.object({
  article: ArticleSchema.and(
    z.object({
      user: UserSchema,
    }),
  ).and(
    z.object({
      tags: z.array(TagSchema),
    }),
  ),
});

export type ShowArticleData = z.infer<typeof showArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Show article error                             */
/* -------------------------------------------------------------------------- */

export type ShowArticleError = NotFoundError;
