import type { Article, User } from "@prisma/client";
import { z } from "zod";
import { makePageSizeSchema, PageSchema } from "../paginations";
import {
  ArticleOrderByWithRelationInputSchema,
  ArticleWhereInputSchema,
  ArticleSchema,
} from "~/utils/requests/models/articles";
import { UserSchema } from "~/utils/requests/models/users";

/* -------------------------------------------------------------------------- */
/*                             Index article query                            */
/* -------------------------------------------------------------------------- */

export const IndexArticleQuerySchema = z
  .object({
    where: ArticleWhereInputSchema,
    orderBy: ArticleOrderByWithRelationInputSchema,
    page: PageSchema,
    pageSize: makePageSizeSchema(articleConfig.DEFAULT_PAGE_SIZE),
  })
  .partial();

export type IndexArticleQuery = z.infer<typeof IndexArticleQuerySchema>;

/* -------------------------------------------------------------------------- */
/*                             Index article data                             */
/* -------------------------------------------------------------------------- */

export const IndexArticleDataSchema = z.object({
  articles: z.array(
    ArticleSchema.and(
      z.object({
        user: UserSchema,
      }),
    ),
  ),
});

export type IndexArticleData = {
  articles: (Article & {
    user: Omit<User, "password" | "email" | "emailVerifiedAt">;
  })[];
};

/* -------------------------------------------------------------------------- */
/*                             Index article error                            */
/* -------------------------------------------------------------------------- */

export type IndexArticleError = RequestErrorMessage<IndexArticleQuery>;
