import { z } from "zod";
import {
  UserSchema,
  ArticleOrderByWithRelationInputSchema,
  ArticleWhereInputSchema,
  ArticleSchema,
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
  TagSchema,
  SavedArticleSchema,
} from "~/utils/schemas";
import { articleConfig } from "~/utils/configs";

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
        .and(
          z
            .object({
              savedArticles: z.array(SavedArticleSchema),
            })
            .optional(),
        ),
    ),
  })
  .merge(PaginationSchema);

export type IndexArticleData = z.infer<typeof IndexArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Index article error                            */
/* -------------------------------------------------------------------------- */

export type IndexArticleError = BadRequestError<IndexArticleQueryPEM>;
