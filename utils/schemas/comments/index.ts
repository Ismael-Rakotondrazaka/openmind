import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  StringFilterSchema,
  SortOrderInputSchema,
  SortOrderSchema,
  DateTimeFilterSchema,
  DateTimeNullableFilterSchema,
  IntFilterSchema,
  ArticleRelationFilterSchema,
  StringNullableFilterSchema,
} from "~/utils/schemas";

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().nullable(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const CommentWhereInputSchema: z.ZodType<Prisma.CommentWhereInput> =
  z.object({
    AND: z
      .union([
        z.lazy(() => CommentWhereInputSchema),
        z.lazy(() => CommentWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CommentWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CommentWhereInputSchema),
        z.lazy(() => CommentWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    parentId: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    userId: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    articleId: z
      .union([z.lazy(() => StringFilterSchema), z.string()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    deletedAt: z
      .union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
      .optional()
      .nullable(),
    parent: z
      .union([
        z.lazy(() => CommentNullableRelationFilterSchema),
        z.lazy(() => CommentWhereInputSchema),
      ])
      .optional()
      .nullable(),
    replies: z.lazy(() => CommentListRelationFilterSchema).optional(),
    article: z
      .union([
        z.lazy(() => ArticleRelationFilterSchema),
        z.lazy(() => ArticleWhereInputSchema),
      ])
      .optional(),
  });

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
