import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { ArticleCountSchema } from "~/schemas/globalSchemas/articles/articleCount";
import { ArticleAuthSchema } from "~/schemas/globalSchemas/articles/articleAuth";
import { ArticleSchema } from "~/schemas/globalSchemas/articles/article";
import { TagSchema } from "~/schemas/globalSchemas/tags";

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
