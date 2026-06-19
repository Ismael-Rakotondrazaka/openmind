import { z } from 'zod';

export const ToggleSavedPostBodySchema = z.object({
  postId: z.string().uuid(),
});

export const IndexSavedPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  postId: z.string().uuid().optional(),
});

export const IsSavedPostQuerySchema = z.object({
  postId: z.string().uuid(),
});

export type IndexSavedPostsQuery = z.infer<typeof IndexSavedPostsQuerySchema>;
export type IsSavedPostQuery = z.infer<typeof IsSavedPostQuerySchema>;
export type ToggleSavedPostBody = z.infer<typeof ToggleSavedPostBodySchema>;
