import { z } from "zod";
import { makePageSizeSchema, PageSchema } from "../../models/paginations";
import {
  ArticleOrderByWithRelationInputSchema,
  ArticleWhereInputSchema,
  ArticleSchema,
} from "~/utils/models/articles";
import { UserSchema } from "~/utils/models/users";

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

export type IndexArticleError = RequestErrorMessage<IndexArticleQuery>;
