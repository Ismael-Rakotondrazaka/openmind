import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  StringFilterSchema,
  StringNullableFilterSchema,
} from "../types/strings";
import { IntFilterSchema } from "../types/ints";
import {
  DateTimeFilterSchema,
  DateTimeNullableFilterSchema,
} from "../types/dates";
import { BoolFilterSchema } from "../types/booleans";
import { SortOrderInputSchema, SortOrderSchema } from "../types/prisma";

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.coerce.number().int(),
  summary: z.string().nullable(),
  content: z.string(),
  isVisible: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const ArticleWhereInputSchema: z.ZodType<Prisma.ArticleWhereInput> =
  z.object({
    AND: z
      .union([
        z.lazy(() => ArticleWhereInputSchema),
        z.lazy(() => ArticleWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ArticleWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ArticleWhereInputSchema),
        z.lazy(() => ArticleWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    slug: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    userId: z
      .union([z.lazy(() => IntFilterSchema), z.coerce.number()])
      .optional(),
    summary: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    isVisible: z
      .union([z.lazy(() => BoolFilterSchema), z.boolean()])
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
  });

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
