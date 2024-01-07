import type { Article, User } from "@prisma/client";
import { z } from "zod";
import {
  ArticleOrderByWithRelationInputSchema,
  ArticleWhereInputSchema,
} from "../models/articles";
import { makePageSizeSchema, PageSchema } from "../paginations";
import { userSchema } from "~/utils/requests/users";
import { articleSchema } from "~/utils/requests/articles";

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
    articleSchema.and(
      z.object({
        user: userSchema,
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
