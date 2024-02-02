import { z } from "zod";
import {
  makePageSizeSchema,
  PageSchema,
  PaginationSchema,
} from "~/schemas/globalSchemas/paginations";
import { TagOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/tags/tagOrder";
import { TagWhereInputSchema } from "~/schemas/globalSchemas/tags/tagWhere";
import { TagSchema } from "~/schemas/globalSchemas/tags/tag";
import { tagConfig } from "~/configs";

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
