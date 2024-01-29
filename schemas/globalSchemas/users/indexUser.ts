import { z } from "zod";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/schemas/globalSchemas/paginations";
import { TagSchema } from "~/schemas/globalSchemas/tags/tag";
import { UserSchema } from "~/schemas/globalSchemas/users/user";
import { UserOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/users/userOrder";
import { UserWhereInputSchema } from "~/schemas/globalSchemas/users/userWhere";
import { UserCountSchema } from "~/schemas/globalSchemas/users/userCount";
import { UserAuthSchema } from "~/schemas/globalSchemas/users/userAuth";
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
