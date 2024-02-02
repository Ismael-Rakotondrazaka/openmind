import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  DateTimeFilterSchema,
  IntFilterSchema,
} from "~/schemas/globalSchemas/types";

export const FollowWhereInputSchema: z.ZodType<Prisma.FollowWhereInput> =
  z.object({
    AND: z
      .union([
        z.lazy(() => FollowWhereInputSchema),
        z.lazy(() => FollowWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => FollowWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => FollowWhereInputSchema),
        z.lazy(() => FollowWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    followerId: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    followingId: z
      .union([z.lazy(() => IntFilterSchema), z.number()])
      .optional(),
  });
