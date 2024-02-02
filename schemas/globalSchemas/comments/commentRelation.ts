import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const CommentNullableRelationFilterSchema: z.ZodType<Prisma.CommentNullableRelationFilter> =
  z.object({
    is: z
      .lazy(() => CommentWhereInputSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => CommentWhereInputSchema)
      .optional()
      .nullable(),
  });

export const CommentListRelationFilterSchema: z.ZodType<Prisma.CommentListRelationFilter> =
  z.object({
    every: z.lazy(() => CommentWhereInputSchema).optional(),
    some: z.lazy(() => CommentWhereInputSchema).optional(),
    none: z.lazy(() => CommentWhereInputSchema).optional(),
  });
