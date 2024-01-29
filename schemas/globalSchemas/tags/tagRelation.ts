import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TagWhereInputSchema } from "~/schemas/globalSchemas/tags/tagWhere";

export const TagListRelationFilterSchema: z.ZodType<Prisma.TagListRelationFilter> =
  z.object({
    every: z.lazy(() => TagWhereInputSchema).optional(),
    some: z.lazy(() => TagWhereInputSchema).optional(),
    none: z.lazy(() => TagWhereInputSchema).optional(),
  });
