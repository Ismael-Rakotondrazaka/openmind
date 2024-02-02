import { z } from "zod";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/schemas/globalSchemas/paginations";
import { UserOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/users/userOrder";
import { UserWhereInputSchema } from "~/schemas/globalSchemas/users/userWhere";
import { UserFullSchema } from "~/schemas/globalSchemas/users/userFull";
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
    users: z.array(UserFullSchema),
  })
  .merge(PaginationSchema);

export type IndexUserData = z.infer<typeof IndexUserDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Index user error                              */
/* -------------------------------------------------------------------------- */

export type IndexUserError = BadRequestError<IndexUserQueryPEM>;
