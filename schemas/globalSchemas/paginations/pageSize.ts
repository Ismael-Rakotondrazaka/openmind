import { z } from "zod";

export const makePageSizeSchema = (defaultPageSize: number) =>
  z.coerce.number().positive().int().optional().default(defaultPageSize);
