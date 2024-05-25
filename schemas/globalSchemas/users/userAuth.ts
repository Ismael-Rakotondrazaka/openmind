import { z } from "zod";
import { FollowSchema } from "~/prisma/generated/zod";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users/user";

export const UserAuthSchema = z.object({
  _auth: z.object({
    following: FollowSchema.and(
      z.object({
        follower: UserFilteredSchema,
        following: UserFilteredSchema,
      }),
    ).nullable(),
    follower: FollowSchema.and(
      z.object({
        follower: UserFilteredSchema,
        following: UserFilteredSchema,
      }),
    ).nullable(),
  }),
});

export type UserAuth = z.infer<typeof UserAuthSchema>;
