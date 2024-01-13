import { z } from "zod";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/utils/schemas/paginations";
import {
  TagOrderByWithRelationInputSchema,
  TagWhereInputSchema,
  TagSchema,
} from "~/utils/schemas";
import { tagConfig } from "~/utils/configs";

/* -------------------------------------------------------------------------- */
/*                               Index tag query                              */
/* -------------------------------------------------------------------------- */

export const IndexTagQuerySchema = z
  .object({
    where: TagWhereInputSchema,
    orderBy: TagOrderByWithRelationInputSchema,
  })
  .partial()
  .merge(
    z.object({
      page: PageSchema,
      pageSize: makePageSizeSchema(tagConfig.PAGE_SIZE_DEFAULT_VALUE),
    }),
  );

export type IndexTagQuery = z.infer<typeof IndexTagQuerySchema>;

export type IndexTagQueryPEM = RequestErrorMessage<IndexTagQuery>;

/* -------------------------------------------------------------------------- */
/*                               Index tag data                               */
/* -------------------------------------------------------------------------- */

export const IndexTagDataSchema = z
  .object({
    tags: z.array(TagSchema),
  })
  .merge(PaginationSchema);

export type IndexTagData = z.infer<typeof IndexTagDataSchema>;

/* -------------------------------------------------------------------------- */
/*                               Index tag error                              */
/* -------------------------------------------------------------------------- */

export type IndexTagError = BadRequestError<IndexTagQueryPEM>;
