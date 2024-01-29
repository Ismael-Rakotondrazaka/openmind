import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  DateTimeFilterSchema,
  IntFilterSchema,
  StringFilterSchema,
} from "~/schemas/globalSchemas/types";
import {
  ArticleRelationFilterSchema,
  ArticleWhereInputSchema,
} from "~/schemas/globalSchemas/articles";

export const ViewWhereInputSchema: z.ZodType<Prisma.ViewWhereInput> = z.object({
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
  articleId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  article: z
    .union([
      z.lazy(() => ArticleRelationFilterSchema),
      z.lazy(() => ArticleWhereInputSchema),
    ])
    .optional(),
});
