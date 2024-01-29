import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  StringFilterSchema,
  DateTimeFilterSchema,
  DateTimeNullableFilterSchema,
  IntFilterSchema,
  StringNullableFilterSchema,
} from "~/schemas/globalSchemas/types";
import { ArticleRelationFilterSchema } from "~/schemas/globalSchemas/articles";

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
