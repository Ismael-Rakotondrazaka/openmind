import type { Article, User } from "@prisma/client";
import { z } from "zod";
import { UserSchema } from "~/utils/models/users";
import { ArticleSchema } from "~/utils/models/articles";

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
  ),
});

export type DestroyArticleData = {
  article: Article & {
    user: Omit<User, "password" | "email" | "emailVerifiedAt">;
  };
};

/* -------------------------------------------------------------------------- */
/*                            Destroy article error                           */
/* -------------------------------------------------------------------------- */

export type DestroyArticleError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
