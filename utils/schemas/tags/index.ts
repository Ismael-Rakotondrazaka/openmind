import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { IntFilterSchema, StringFilterSchema } from "~/utils/schemas";

export const TagSchema = z.object({
  id: z.number().int(),
  value: z.string(),
});

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

export const TagOrderByWithRelationInputSchema: z.ZodType<Prisma.TagOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    value: z.lazy(() => SortOrderSchema).optional(),
  });

export const TagListRelationFilterSchema: z.ZodType<Prisma.TagListRelationFilter> =
  z
    .object({
      every: z.lazy(() => TagWhereInputSchema).optional(),
      some: z.lazy(() => TagWhereInputSchema).optional(),
      none: z.lazy(() => TagWhereInputSchema).optional(),
    })
    .strict();
