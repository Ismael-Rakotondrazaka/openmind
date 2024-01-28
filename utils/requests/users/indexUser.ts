import { z } from "zod";
import {
  UserSchema,
  UserOrderByWithRelationInputSchema,
  UserWhereInputSchema,
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
  TagSchema,
  UserCountSchema,
  UserAuthSchema,
} from "~/utils/schemas";
import { userConfig } from "~/configs";

/* -------------------------------------------------------------------------- */
/*                              Index user query                              */
/* -------------------------------------------------------------------------- */

export const IndexUserQuerySchema = z
  .object({
    where: UserWhereInputSchema,
    orderBy: UserOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(userConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexUserQuery = z.infer<typeof IndexUserQuerySchema>;

export type IndexUserQueryPEM = RequestErrorMessage<IndexUserQuery>;

/* -------------------------------------------------------------------------- */
/*                               Index user data                              */
/* -------------------------------------------------------------------------- */

export const IndexUserDataSchema = z
  .object({
    users: z.array(
      UserSchema.and(
        z.object({
          tags: z.array(TagSchema),
        }),
      )
        .and(UserCountSchema)
        .and(UserAuthSchema),
    ),
  })
  .merge(PaginationSchema);

export type IndexUserData = z.infer<typeof IndexUserDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Index user error                              */
/* -------------------------------------------------------------------------- */

export type IndexUserError = BadRequestError<IndexUserQueryPEM>;
