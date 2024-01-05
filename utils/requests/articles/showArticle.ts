import type { Article, User } from "@prisma/client";
import { z } from "zod";
import { userSchema } from "~/utils/requests/users";
import { articleSchema } from "~/utils/requests/articles";

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
  article: articleSchema.and(
    z.object({
      user: userSchema,
    }),
  ),
});

export type ShowArticleData = {
  article: Article & {
    user: Omit<User, "password" | "email" | "emailVerifiedAt">;
  };
};

/* -------------------------------------------------------------------------- */
/*                             Show article error                             */
/* -------------------------------------------------------------------------- */

export type ShowArticleError = NotFoundError;
