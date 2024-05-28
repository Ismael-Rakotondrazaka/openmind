import { z } from "zod";

export const PaginationLinksSchema = z.object({
  current: z.string(),
  previous: z.string().nullable(),
  next: z.string().nullable(),
});
export type PaginationLinks = z.infer<typeof PaginationLinksSchema>;
