import { z } from "zod";

export const FollowSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  followerId: z.number().int(),
  followingId: z.number().int(),
});

export type Follow = z.infer<typeof FollowSchema>;
