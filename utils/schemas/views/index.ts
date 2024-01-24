import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  SortOrderSchema,
  DateTimeFilterSchema,
  ArticleWhereInputSchema,
  IntFilterSchema,
  ArticleRelationFilterSchema,
  StringFilterSchema,
  ArticleOrderByWithRelationInputSchema,
} from "~/utils/schemas";

export const ViewSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.number().int(),
  articleId: z.string(),
});

export const ViewWhereInputSchema: z.ZodType<Prisma.ViewWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => ViewWhereInputSchema),
        z.lazy(() => ViewWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ViewWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ViewWhereInputSchema),
        z.lazy(() => ViewWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    userId: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    articleId: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    article: z
      .union([
        z.lazy(() => ArticleRelationFilterSchema),
        z.lazy(() => ArticleWhereInputSchema),
      ])
      .optional(),
  })
  .strict();

export const ViewOrderByWithRelationInputSchema: z.ZodType<Prisma.ViewOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      userId: z.lazy(() => SortOrderSchema).optional(),
      articleId: z.lazy(() => SortOrderSchema).optional(),
      article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional(),
    })
    .strict();
