import { z } from "zod";
import { commentConfig } from "~/configs";
import { CommentFullSchema } from "~/schemas/globalSchemas/comments/comment";
import { CommentOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/comments/commentOrder";
import { CommentWhereInputSchema } from "~/schemas/globalSchemas/comments/commentWhere";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/schemas/globalSchemas/paginations";

/* -------------------------------------------------------------------------- */
/*                             Index comment query                            */
/* -------------------------------------------------------------------------- */

export const IndexCommentQuerySchema = z
  .object({
    where: CommentWhereInputSchema,
    orderBy: CommentOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(commentConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexCommentQuery = z.infer<typeof IndexCommentQuerySchema>;

export type IndexCommentQueryPEM = RequestErrorMessage<IndexCommentQuery>;

/* -------------------------------------------------------------------------- */
/*                             Index comment data                             */
/* -------------------------------------------------------------------------- */

export const IndexCommentDataSchema = z
  .object({
    comments: z.array(CommentFullSchema),
  })
  .merge(PaginationSchema);

export type IndexCommentData = z.infer<typeof IndexCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Index comment error                            */
/* -------------------------------------------------------------------------- */

export type IndexCommentError = BadRequestError<IndexCommentQueryPEM>;
