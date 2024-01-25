import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  DateTimeFilterSchema,
  IntFilterSchema,
  UserOrderByWithRelationInputSchema,
} from "~/utils/schemas";

export const FollowSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  followerId: z.number().int(),
  followingId: z.number().int(),
});

export type Follow = z.infer<typeof FollowSchema>;

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

export const FollowOrderByWithRelationInputSchema: z.ZodType<Prisma.FollowOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    followerId: z.lazy(() => SortOrderSchema).optional(),
    followingId: z.lazy(() => SortOrderSchema).optional(),
    follower: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
    following: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  });
