import { z } from "zod";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "../../models/paginations";
import {
  ArticleOrderByWithRelationInputSchema,
  ArticleWhereInputSchema,
  ArticleSchema,
} from "~/utils/models/articles";
import { UserSchema } from "~/utils/models/users";
import { articleConfig } from "~/utils/configs";

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

export type IndexArticleQueryPEM = RequestErrorMessage<IndexArticleQuery>;

/* -------------------------------------------------------------------------- */
/*                             Index article data                             */
/* -------------------------------------------------------------------------- */

export const IndexArticleDataSchema = z
  .object({
    articles: z.array(
      ArticleSchema.and(
        z.object({
          user: UserSchema,
        }),
      ),
    ),
  })
  .merge(PaginationSchema);

export type IndexArticleData = z.infer<typeof IndexArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Index article error                            */
/* -------------------------------------------------------------------------- */

export type IndexArticleError = BadRequestError<IndexArticleQueryPEM>;
