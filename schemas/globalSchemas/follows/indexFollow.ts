import { z } from "zod";
import { followConfig } from "~/configs";
import {
  FollowOrderByWithRelationInputSchema,
  FollowWhereInputSchema,
} from "~/prisma/generated/zod";
import { FollowFullSchema } from "~/schemas/globalSchemas/follows/follow";
import {
  PageSchema,
  PaginationSchema,
  makePageSizeSchema,
} from "~/schemas/globalSchemas/paginations";

/* -------------------------------------------------------------------------- */
/*                             Index follow query                             */
/* -------------------------------------------------------------------------- */

export const IndexFollowQuerySchema = z
  .object({
    where: FollowWhereInputSchema,
    orderBy: FollowOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(followConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexFollowQuery = z.infer<typeof IndexFollowQuerySchema>;

export type IndexFollowQueryPEM = RequestErrorMessage<IndexFollowQuery>;

/* -------------------------------------------------------------------------- */
/*                              Index follow data                             */
/* -------------------------------------------------------------------------- */

export const IndexFollowDataSchema = z
  .object({
    follows: z.array(FollowFullSchema),
  })
  .merge(PaginationSchema);

export type IndexFollowData = z.infer<typeof IndexFollowDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Index follow error                             */
/* -------------------------------------------------------------------------- */

export type IndexFollowError = BadRequestError<IndexFollowQueryPEM>;
