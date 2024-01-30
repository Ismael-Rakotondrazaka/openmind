import { z } from "zod";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/schemas/globalSchemas/paginations";
import {
  ArticleFullSchema,
  ArticleOrderByWithRelationInputSchema,
} from "~/schemas/globalSchemas/articles";
import { articleConfig } from "~/configs";

/* -------------------------------------------------------------------------- */
/*                       Index recommended article query                      */
/* -------------------------------------------------------------------------- */

export const IndexRecommendedArticleQuerySchema = z
  .object({
    orderBy: ArticleOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(articleConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexRecommendedArticleQuery = z.infer<
  typeof IndexRecommendedArticleQuerySchema
>;

export type IndexRecommendedArticleQueryPEM =
  RequestErrorMessage<IndexRecommendedArticleQuery>;

/* -------------------------------------------------------------------------- */
/*                       Index recommended article data                       */
/* -------------------------------------------------------------------------- */

export const IndexRecommendedArticleDataSchema = z
  .object({
    articles: z.array(ArticleFullSchema),
  })
  .merge(PaginationSchema);

export type IndexRecommendedArticleData = z.infer<
  typeof IndexRecommendedArticleDataSchema
>;

/* -------------------------------------------------------------------------- */
/*                       Index recommended article error                      */
/* -------------------------------------------------------------------------- */

export type IndexRecommendedArticleError =
  | BadRequestError<IndexRecommendedArticleQueryPEM>
  | UnauthorizedError;
