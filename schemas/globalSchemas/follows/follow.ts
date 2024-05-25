import { z } from "zod";
import { FollowSchema } from "~/prisma/generated/zod";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users/user";

export const FollowFullSchema = FollowSchema.merge(
  z.object({
    following: UserFilteredSchema,
    follower: UserFilteredSchema,
  }),
);

export type FollowFull = z.infer<typeof FollowFullSchema>;
