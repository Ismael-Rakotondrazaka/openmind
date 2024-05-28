import { z } from "zod";
import { articleConfig } from "~/configs";
import {
  ArticleOrderByWithRelationInputSchema,
  ArticleWhereInputSchema,
} from "~/prisma/generated/zod";
import { ArticleFullSchema } from "~/schemas/globalSchemas/articles/article";
import {
  PageSchema,
  PaginationSchema,
  makePageSizeSchema,
} from "~/schemas/globalSchemas/paginations";

/* -------------------------------------------------------------------------- */
/*                             Index article query                            */
/* -------------------------------------------------------------------------- */

export const IndexArticleQuerySchema = z
  .object({
    where: ArticleWhereInputSchema,
    orderBy: ArticleOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(articleConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexArticleQuery = z.infer<typeof IndexArticleQuerySchema>;

export type IndexArticleQueryPEM = RequestErrorMessage<IndexArticleQuery>;

/* -------------------------------------------------------------------------- */
/*                             Index article data                             */
/* -------------------------------------------------------------------------- */

export const IndexArticleDataSchema = z
  .object({
    articles: z.array(ArticleFullSchema),
  })
  .merge(PaginationSchema);

export type IndexArticleData = z.infer<typeof IndexArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Index article error                            */
/* -------------------------------------------------------------------------- */

export type IndexArticleError = BadRequestError<IndexArticleQueryPEM>;
