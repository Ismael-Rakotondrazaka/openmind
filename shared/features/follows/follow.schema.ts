import { z } from 'zod';

export const ToggleFollowBodySchema = z.object({
  followingId: z.string().uuid(),
});

export const FollowParamsSchema = z.object({
  userId: z.string().uuid(),
});

export const IndexFollowsQuerySchema = z.object({
  followerId: z.string().uuid().optional(),
  followingId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

export type FollowParams = z.infer<typeof FollowParamsSchema>;
export type IndexFollowsQuery = z.infer<typeof IndexFollowsQuerySchema>;
export type ToggleFollowBody = z.infer<typeof ToggleFollowBodySchema>;
