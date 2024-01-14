import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { StringFilterSchema } from "../types/strings";
import { DateTimeFilterSchema } from "../types/dates";
import { SortOrderSchema } from "../types/prisma";
import { ArticleRelationFilterSchema } from "../articles";

export const SavedArticleSchema = z.object({
  articleId: z.string(),
  userId: z.number().int(),
  createdAt: z.coerce.date(),
});

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

export const SavedArticleOrderByWithRelationInputSchema: z.ZodType<Prisma.SavedArticleOrderByWithRelationInput> =
  z.object({
    articleId: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional(),
  });
