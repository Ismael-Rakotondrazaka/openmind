import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  SortOrderInputSchema,
  SortOrderSchema,
} from "~/schemas/globalSchemas/types";
import { ArticleOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/articles/articleOrderBy";
import { CommentOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/comments/commentOrder";

export const ReactionOrderByWithRelationInputSchema: z.ZodType<Prisma.ReactionOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    type: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    articleId: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputSchema),
      ])
      .optional(),
    commentId: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputSchema),
      ])
      .optional(),
    article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional(),
    comment: z.lazy(() => CommentOrderByWithRelationInputSchema).optional(),
  });
