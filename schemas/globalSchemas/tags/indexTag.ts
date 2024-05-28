import { z } from "zod";
import { tagConfig } from "~/configs";
import {
  TagOrderByWithRelationInputSchema,
  TagSchema,
  TagWhereInputSchema,
} from "~/prisma/generated/zod";
import {
  PageSchema,
  PaginationSchema,
  makePageSizeSchema,
} from "~/schemas/globalSchemas/paginations";

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
