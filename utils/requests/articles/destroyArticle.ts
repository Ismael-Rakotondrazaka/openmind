import { z } from "zod";
import { UserSchema } from "~/utils/schemas/users";
import { ArticleSchema } from "~/utils/schemas/articles";

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
  ).and(
    z.object({
      tags: z.array(TagSchema),
    }),
  ),
});

export type DestroyArticleData = z.infer<typeof DestroyArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy article error                           */
/* -------------------------------------------------------------------------- */

export type DestroyArticleError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
