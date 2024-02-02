import { z } from "zod";

export const PageSchema = z.coerce
  .number()
  .positive()
  .int()
  .optional()
  .default(1);

export type Page = z.infer<typeof PageSchema>;
