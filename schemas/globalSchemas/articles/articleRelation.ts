import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const ArticleRelationFilterSchema: z.ZodType<Prisma.ArticleRelationFilter> =
  z.object({
    is: z.lazy(() => ArticleWhereInputSchema).optional(),
    isNot: z.lazy(() => ArticleWhereInputSchema).optional(),
  });

export const ArticleNullableRelationFilterSchema: z.ZodType<Prisma.ArticleNullableRelationFilter> =
  z.object({
    is: z
      .lazy(() => ArticleWhereInputSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => ArticleWhereInputSchema)
      .optional()
      .nullable(),
  });
