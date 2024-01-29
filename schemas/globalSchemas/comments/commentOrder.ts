import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  SortOrderInputSchema,
  SortOrderSchema,
} from "~/schemas/globalSchemas/types/prisma";

export const CommentOrderByWithRelationInputSchema: z.ZodType<Prisma.CommentOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    content: z.lazy(() => SortOrderSchema).optional(),
    parentId: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputSchema),
      ])
      .optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    articleId: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
    deletedAt: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputSchema),
      ])
      .optional(),
    parent: z.lazy(() => CommentOrderByWithRelationInputSchema).optional(),
    replies: z
      .lazy(() => CommentOrderByRelationAggregateInputSchema)
      .optional(),
    article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional(),
  });

export const CommentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CommentOrderByRelationAggregateInput> =
  z.object({
    _count: z.lazy(() => SortOrderSchema).optional(),
  });
