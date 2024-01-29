import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  StringFilterSchema,
  DateTimeFilterSchema,
} from "~/schemas/globalSchemas/types";
import { ArticleRelationFilterSchema } from "~/schemas/globalSchemas/articles";

export const SavedArticleWhereInputSchema: z.ZodType<Prisma.SavedArticleWhereInput> =
  z.object({
    AND: z
      .union([
        z.lazy(() => SavedArticleWhereInputSchema),
        z.lazy(() => SavedArticleWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => SavedArticleWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => SavedArticleWhereInputSchema),
        z.lazy(() => SavedArticleWhereInputSchema).array(),
      ])
      .optional(),
    articleId: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    article: z
      .union([
        z.lazy(() => ArticleRelationFilterSchema),
        z.lazy(() => ArticleWhereInputSchema),
      ])
      .optional(),
  });
