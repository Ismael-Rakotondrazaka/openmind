import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/schemas/globalSchemas/paginations";
import { TagSchema } from "~/schemas/globalSchemas/tags";
import {
  ArticleSchema,
  ArticleCountSchema,
  ArticleAuthSchema,
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
    articles: z.array(
      ArticleSchema.and(
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
    ),
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
