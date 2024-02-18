import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users/user";
import { FollowSchema } from "~/schemas/globalSchemas/follows";

export const UserAuthSchema = z.object({
  _auth: z.object({
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
  }),
});

export type UserAuth = z.infer<typeof UserAuthSchema>;
