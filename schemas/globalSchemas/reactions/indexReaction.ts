import { z } from "zod";
import { reactionConfig } from "~/configs";
import {
  ReactionOrderByWithRelationInputSchema,
  ReactionWhereInputSchema,
} from "~/prisma/generated/zod";
import {
  PageSchema,
  PaginationSchema,
  makePageSizeSchema,
} from "~/schemas/globalSchemas/paginations";
import { ReactionFullSchema } from "~/schemas/globalSchemas/reactions/reaction";

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
    reactions: z.array(ReactionFullSchema),
  })
  .merge(PaginationSchema);

export type IndexReactionData = z.infer<typeof IndexReactionDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Index reaction error                            */
/* -------------------------------------------------------------------------- */

export type IndexReactionError = BadRequestError<IndexReactionQueryPEM>;
