import { z } from "zod";
import { viewConfig } from "~/configs";
import {
  ViewOrderByWithRelationInputSchema,
  ViewWhereInputSchema,
} from "~/prisma/generated/zod";
import {
  PageSchema,
  PaginationSchema,
  makePageSizeSchema,
} from "~/schemas/globalSchemas/paginations";
import { ViewFullSchema } from "~/schemas/globalSchemas/views/viewFull";

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
    views: z.array(ViewFullSchema),
  })
  .merge(PaginationSchema);

export type IndexViewData = z.infer<typeof IndexViewDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Index view error                              */
/* -------------------------------------------------------------------------- */

export type IndexViewError = BadRequestError<IndexViewQueryPEM>;
