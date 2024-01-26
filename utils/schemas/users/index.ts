import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { RoleSchema } from "~/utils/schemas/roles";
import {
  FollowListRelationFilterSchema,
  FollowSchema,
} from "~/utils/schemas/follows";

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.coerce.number().int(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  profileUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    username: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    firstName: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  });

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

export const UserCountSchema = z.object({
  _count: z.object({
    tags: z.number().nonnegative().int(),
    followers: z.number().nonnegative().int(),
    following: z.number().nonnegative().int(),
    articles: z.number().nonnegative().int(),
  }),
});

export type UserCount = z.infer<typeof UserCountSchema>;

export const UserAuthSchema = z.object({
  auth: z
    .object({
      following: FollowSchema.and(
        z.object({
          follower: UserSchema,
          following: UserSchema,
        }),
      ).nullable(),
      follower: FollowSchema.and(
        z.object({
          follower: UserSchema,
          following: UserSchema,
        }),
      ).nullable(),
    })
    .nullable(),
});

export type UserAuth = z.infer<typeof UserAuthSchema>;
