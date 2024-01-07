import { z } from "zod";

export const PageSchema = z.coerce
  .number()
  .positive()
  .int()
  .optional()
  .default(1);

export const makePageSizeSchema = (defaultPageSize: number) =>
  z.coerce.number().positive().int().optional().default(defaultPageSize);

export const PaginationLinksSchema = z.object({
  current: z.string(),
  previous: z.string().nullable(),
  next: z.string().nullable(),
});

export const PaginationSchema = z.object({
  count: z.coerce.number(),
  totalCounts: z.coerce.number(),
  page: z.coerce.number(),
  pageSize: z.coerce.number(),
  totalPages: z.coerce.number(),
  links: PaginationLinksSchema,
});

export type PaginationLinks = z.infer<typeof PaginationLinksSchema>;

export type Pagination = z.infer<typeof PaginationSchema>;
