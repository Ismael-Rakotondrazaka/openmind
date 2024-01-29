import { z } from "zod";
import { ReactionSchema } from "~/schemas/globalSchemas/reactions/reaction";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { ReactionOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/reactions/reactionOrder";
import { ReactionWhereInputSchema } from "~/schemas/globalSchemas/reactions/reactionWhere";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/schemas/globalSchemas/paginations";
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
