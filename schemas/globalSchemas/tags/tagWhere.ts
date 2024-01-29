import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  IntFilterSchema,
  StringFilterSchema,
} from "~/schemas/globalSchemas/types";

export const TagWhereInputSchema: z.ZodType<Prisma.TagWhereInput> = z.object({
  AND: z
    .union([
      z.lazy(() => TagWhereInputSchema),
      z.lazy(() => TagWhereInputSchema).array(),
    ])
    .optional(),
  OR: z
    .lazy(() => TagWhereInputSchema)
    .array()
    .optional(),
  NOT: z
    .union([
      z.lazy(() => TagWhereInputSchema),
      z.lazy(() => TagWhereInputSchema).array(),
    ])
    .optional(),
  id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  value: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
});
