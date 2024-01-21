import { z } from "zod";
import {
  UserSchema,
  CommentOrderByWithRelationInputSchema,
  CommentWhereInputSchema,
  CommentSchema,
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/utils/schemas";
import { commentConfig } from "~/utils/configs";

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
    comments: z.array(
      CommentSchema.and(
        z.object({
          user: UserSchema,
        }),
      ).and(
        z.object({
          _count: z.object({
            replies: z.coerce.number().positive().int(),
          }),
        }),
      ),
    ),
  })
  .merge(PaginationSchema);

export type IndexCommentData = z.infer<typeof IndexCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Index comment error                            */
/* -------------------------------------------------------------------------- */

export type IndexCommentError = BadRequestError<IndexCommentQueryPEM>;
