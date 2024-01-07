import { z } from "zod";

export const PageSchema = z.coerce
  .number()
  .positive()
  .int()
  .optional()
  .default(1);

export const makePageSizeSchema = (defaultPageSize: number) =>
  z.coerce.number().positive().int().optional().default(defaultPageSize);

export type PaginationLinks = {
  current: string;
  previous: string | null;
  next: string | null;
};
