import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { SortOrderSchema } from "~/schemas/globalSchemas/types";
import { ArticleOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/articles";

export const ViewOrderByWithRelationInputSchema: z.ZodType<Prisma.ViewOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
    userId: z.lazy(() => SortOrderSchema).optional(),
    articleId: z.lazy(() => SortOrderSchema).optional(),
    article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional(),
  });
