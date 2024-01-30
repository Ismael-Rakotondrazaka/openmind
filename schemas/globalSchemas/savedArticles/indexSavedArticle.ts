import { z } from "zod";
import { ArticleFullSchema } from "~/schemas/globalSchemas/articles";
import {
  SavedArticleSchema,
  SavedArticleWhereInputSchema,
  SavedArticleOrderByWithRelationInputSchema,
} from "~/schemas/globalSchemas/savedArticles";
import {
  PaginationSchema,
  PageSchema,
  makePageSizeSchema,
} from "~/schemas/globalSchemas/paginations";
import { articleConfig } from "~/configs";

/* -------------------------------------------------------------------------- */
/*                          Index saved article query                         */
/* -------------------------------------------------------------------------- */

export const IndexSavedArticleQuerySchema = z
  .object({
    where: SavedArticleWhereInputSchema,
    orderBy: SavedArticleOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(articleConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexSavedArticleQuery = z.infer<
  typeof IndexSavedArticleQuerySchema
>;

export type IndexSavedArticleQueryPEM =
  RequestErrorMessage<IndexSavedArticleQuery>;

/* -------------------------------------------------------------------------- */
/*                          Index saved article data                          */
/* -------------------------------------------------------------------------- */

export const IndexSavedArticleDataSchema = z
  .object({
    savedArticles: z.array(
      SavedArticleSchema.and(
        z.object({
          article: ArticleFullSchema,
        }),
      ),
    ),
  })
  .merge(PaginationSchema);

export type IndexSavedArticleData = z.infer<typeof IndexSavedArticleDataSchema>;

/* -------------------------------------------------------------------------- */
/*                          Index saved article error                         */
/* -------------------------------------------------------------------------- */

export type IndexSavedArticleError =
  | BadRequestError<IndexSavedArticleQueryPEM>
  | UnauthorizedError;
