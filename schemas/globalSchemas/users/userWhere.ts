import { z } from "zod";
import type { Prisma } from "@prisma/client";
import {
  IntFilterSchema,
  StringFilterSchema,
  DateTimeFilterSchema,
} from "~/schemas/globalSchemas/types";
import { FollowListRelationFilterSchema } from "~/schemas/globalSchemas/follows";
import { TagListRelationFilterSchema } from "~/schemas/globalSchemas/tags";

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z
    .union([
      z.lazy(() => UserWhereInputSchema),
      z.lazy(() => UserWhereInputSchema).array(),
    ])
    .optional(),
  OR: z
    .lazy(() => UserWhereInputSchema)
    .array()
    .optional(),
  NOT: z
    .union([
      z.lazy(() => UserWhereInputSchema),
      z.lazy(() => UserWhereInputSchema).array(),
    ])
    .optional(),
  id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  username: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z
    .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
    .optional(),
  updatedAt: z
    .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
    .optional(),
  tags: z.lazy(() => TagListRelationFilterSchema).optional(),
  following: z.lazy(() => FollowListRelationFilterSchema).optional(),
  followers: z.lazy(() => FollowListRelationFilterSchema).optional(),
});
