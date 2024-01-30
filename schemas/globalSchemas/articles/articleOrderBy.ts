import { z } from "zod";
import type { Prisma } from "@prisma/client";
import {
  SortOrderInputSchema,
  SortOrderSchema,
} from "~/schemas/globalSchemas/types/prisma";

export const ArticleOrderByWithRelationInputSchema: z.ZodType<Prisma.ArticleOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    title: z.lazy(() => SortOrderSchema).optional(),
    slug: z.lazy(() => SortOrderSchema).optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    summary: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputSchema),
      ])
      .optional(),
    content: z.lazy(() => SortOrderSchema).optional(),
    isVisible: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
    deletedAt: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputSchema),
      ])
      .optional(),
  });

export type ArticleOrderByWithRelationInput = z.infer<
  typeof ArticleOrderByWithRelationInputSchema
>;
