import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users";

export const FollowSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  followerId: z.number().int(),
  followingId: z.number().int(),
});

export type Follow = z.infer<typeof FollowSchema>;

export const FollowFullSchema = FollowSchema.merge(
  z.object({
    following: UserSchema,
    follower: UserSchema,
  }),
);

export type FollowFull = z.infer<typeof FollowFullSchema>;
