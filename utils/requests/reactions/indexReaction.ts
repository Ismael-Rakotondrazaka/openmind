import { z } from "zod";
import {
  UserSchema,
  ReactionOrderByWithRelationInputSchema,
  ReactionWhereInputSchema,
  ReactionSchema,
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/utils/schemas";
import { reactionConfig } from "~/configs";

/* -------------------------------------------------------------------------- */
/*                            Index reaction query                            */
/* -------------------------------------------------------------------------- */

export const IndexReactionQuerySchema = z
  .object({
    where: ReactionWhereInputSchema,
    orderBy: ReactionOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(reactionConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexReactionQuery = z.infer<typeof IndexReactionQuerySchema>;

export type IndexReactionQueryPEM = RequestErrorMessage<IndexReactionQuery>;

/* -------------------------------------------------------------------------- */
/*                             Index reaction data                            */
/* -------------------------------------------------------------------------- */

export const IndexReactionDataSchema = z
  .object({
    reactions: z.array(
      ReactionSchema.and(
        z.object({
          user: UserSchema,
        }),
      ),
    ),
  })
  .merge(PaginationSchema);

export type IndexReactionData = z.infer<typeof IndexReactionDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Index reaction error                            */
/* -------------------------------------------------------------------------- */

export type IndexReactionError = BadRequestError<IndexReactionQueryPEM>;
