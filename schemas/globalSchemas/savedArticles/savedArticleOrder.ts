import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { SortOrderSchema } from "~/schemas/globalSchemas/types";
import { ArticleOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/articles";

export const SavedArticleOrderByWithRelationInputSchema: z.ZodType<Prisma.SavedArticleOrderByWithRelationInput> =
  z.object({
    articleId: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional(),
  });
