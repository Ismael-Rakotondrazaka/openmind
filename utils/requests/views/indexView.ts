import { z } from "zod";
import {
  UserSchema,
  ViewOrderByWithRelationInputSchema,
  ViewWhereInputSchema,
  ViewSchema,
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/utils/schemas";
import { viewConfig } from "~/utils/configs";

/* -------------------------------------------------------------------------- */
/*                              Index view query                              */
/* -------------------------------------------------------------------------- */

export const IndexViewQuerySchema = z
  .object({
    where: ViewWhereInputSchema,
    orderBy: ViewOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(viewConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexViewQuery = z.infer<typeof IndexViewQuerySchema>;

export type IndexViewQueryPEM = RequestErrorMessage<IndexViewQuery>;

/* -------------------------------------------------------------------------- */
/*                               Index view data                              */
/* -------------------------------------------------------------------------- */

export const IndexViewDataSchema = z
  .object({
    views: z.array(
      ViewSchema.and(
        z.object({
          user: UserSchema,
        }),
      ),
    ),
  })
  .merge(PaginationSchema);

export type IndexViewData = z.infer<typeof IndexViewDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Index view error                              */
/* -------------------------------------------------------------------------- */

export type IndexViewError = BadRequestError<IndexViewQueryPEM>;
