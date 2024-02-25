import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { ArticleNullableRelationFilterSchema } from "~/schemas/globalSchemas/articles";
import { CommentNullableRelationFilterSchema } from "~/schemas/globalSchemas/comments";
import { ReactionTypeSchema } from "~/schemas/globalSchemas/reactions";
import {
  StringNullableFilterSchema,
  DateTimeFilterSchema,
  IntFilterSchema,
} from "~/schemas/globalSchemas/types";

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
