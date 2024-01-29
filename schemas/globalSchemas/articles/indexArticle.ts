import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { ArticleOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/articles/articleOrderBy";
import { ArticleWhereInputSchema } from "~/schemas/globalSchemas/articles/articleWhere";
import { ArticleCountSchema } from "~/schemas/globalSchemas/articles/articleCount";
import { ArticleAuthSchema } from "~/schemas/globalSchemas/articles/articleAuth";
import { ArticleSchema } from "~/schemas/globalSchemas/articles/article";
import { TagSchema } from "~/schemas/globalSchemas/tags";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/schemas/globalSchemas/paginations";
import { articleConfig } from "~/configs";

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
        .and(ArticleCountSchema)
        .and(ArticleAuthSchema),
    ),
  })
  .merge(PaginationSchema);

export type IndexArticleData = z.infer<typeof IndexArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Index article error                            */
/* -------------------------------------------------------------------------- */

export type IndexArticleError = BadRequestError<IndexArticleQueryPEM>;
