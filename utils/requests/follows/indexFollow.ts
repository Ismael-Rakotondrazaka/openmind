import { z } from "zod";
import {
  UserSchema,
  FollowOrderByWithRelationInputSchema,
  FollowWhereInputSchema,
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
  FollowSchema,
} from "~/utils/schemas";
import { followConfig } from "~/utils/configs";

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
    follows: z.array(
      FollowSchema.and(
        z.object({
          following: UserSchema,
        }),
      ).and(
        z.object({
          follower: UserSchema,
        }),
      ),
    ),
  })
  .merge(PaginationSchema);

export type IndexFollowData = z.infer<typeof IndexFollowDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Index follow error                             */
/* -------------------------------------------------------------------------- */

export type IndexFollowError = BadRequestError<IndexFollowQueryPEM>;
