import { z } from "zod";
import { PaginationLinksSchema } from "~/schemas/globalSchemas/paginations/paginationLink";

export const PaginationSchema = z.object({
  count: z.coerce.number(),
  totalCounts: z.coerce.number(),
  page: z.coerce.number(),
  pageSize: z.coerce.number(),
  totalPages: z.coerce.number(),
  links: PaginationLinksSchema,
});

export type Pagination = z.infer<typeof PaginationSchema>;
