import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  ArticleNullableRelationFilterSchema,
  CommentNullableRelationFilterSchema,
  StringNullableFilterSchema,
  SortOrderInputSchema,
  SortOrderSchema,
  DateTimeFilterSchema,
  IntFilterSchema,
} from "~/utils/schemas";

export const ReactionTypeSchema = z.enum(["like", "love", "celebrate"]);

export type ReactionType = z.infer<typeof ReactionTypeSchema>;

export const ReactionSchema = z.object({
  type: ReactionTypeSchema,
  id: z.number().int(),
  createdAt: z.coerce.date(),
  userId: z.number().int(),
  articleId: z.string().nullable(),
  commentId: z.string().nullable(),
});

export const NestedEnumReactionTypeFilterSchema: z.ZodType<Prisma.NestedEnumReactionTypeFilter> =
  z.object({
    equals: z.lazy(() => ReactionTypeSchema).optional(),
    in: z
      .lazy(() => ReactionTypeSchema)
      .array()
      .optional(),
    notIn: z
      .lazy(() => ReactionTypeSchema)
      .array()
      .optional(),
    not: z
      .union([
        z.lazy(() => ReactionTypeSchema),
        z.lazy(() => NestedEnumReactionTypeFilterSchema),
      ])
      .optional(),
  });

export const EnumReactionTypeFilterSchema: z.ZodType<Prisma.EnumReactionTypeFilter> =
  z.object({
    equals: z.lazy(() => ReactionTypeSchema).optional(),
    in: z
      .lazy(() => ReactionTypeSchema)
      .array()
      .optional(),
    notIn: z
      .lazy(() => ReactionTypeSchema)
      .array()
      .optional(),
    not: z
      .union([
        z.lazy(() => ReactionTypeSchema),
        z.lazy(() => NestedEnumReactionTypeFilterSchema),
      ])
      .optional(),
  });

export const ReactionWhereInputSchema: z.ZodType<Prisma.ReactionWhereInput> =
  z.object({
    AND: z
      .union([
        z.lazy(() => ReactionWhereInputSchema),
        z.lazy(() => ReactionWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ReactionWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ReactionWhereInputSchema),
        z.lazy(() => ReactionWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    type: z
      .union([
        z.lazy(() => EnumReactionTypeFilterSchema),
        z.lazy(() => ReactionTypeSchema),
      ])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    userId: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    articleId: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    commentId: z
      .union([z.lazy(() => StringNullableFilterSchema), z.string()])
      .optional()
      .nullable(),
    article: z
      .union([
        z.lazy(() => ArticleNullableRelationFilterSchema),
        z.lazy(() => ArticleWhereInputSchema),
      ])
      .optional()
      .nullable(),
    comment: z
      .union([
        z.lazy(() => CommentNullableRelationFilterSchema),
        z.lazy(() => CommentWhereInputSchema),
      ])
      .optional()
      .nullable(),
  });

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
