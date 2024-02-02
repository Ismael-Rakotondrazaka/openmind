import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  StringFilterSchema,
  StringNullableFilterSchema,
} from "~/schemas/globalSchemas/types/strings";
import { IntFilterSchema } from "~/schemas/globalSchemas/types/ints";
import {
  DateTimeFilterSchema,
  DateTimeNullableFilterSchema,
} from "~/schemas/globalSchemas/types/dates";
import { BoolFilterSchema } from "~/schemas/globalSchemas/types/booleans";
import { TagListRelationFilterSchema } from "~/schemas/globalSchemas/tags";

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
    tags: z.lazy(() => TagListRelationFilterSchema).optional(),
  });
