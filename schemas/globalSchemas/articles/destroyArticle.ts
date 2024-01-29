import { z } from "zod";
import { ArticleSchema } from "~/schemas/globalSchemas/articles";
import { TagSchema } from "~/schemas/globalSchemas/tags";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { ArticleCountSchema } from "~/schemas/globalSchemas/articles/articleCount";
import { ArticleAuthSchema } from "~/schemas/globalSchemas/articles/articleAuth";

/* -------------------------------------------------------------------------- */
/*                            Destroy article param                           */
/* -------------------------------------------------------------------------- */

export const DestroyArticleParamSchema = z.object({
  slug: z.string().trim(),
});

export type DestroyArticleParam = z.infer<typeof DestroyArticleParamSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy article data                            */
/* -------------------------------------------------------------------------- */

export const DestroyArticleDataSchema = z.object({
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

export type DestroyArticleData = z.infer<typeof DestroyArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy article error                           */
/* -------------------------------------------------------------------------- */

export type DestroyArticleError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
