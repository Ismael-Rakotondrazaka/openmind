import { z } from 'zod';

import { PostStatus } from './post.model';

export const CreatePostBodySchema = z.object({
  content: z.record(z.unknown()),
  coverUrl: z.string().url().nullable().optional(),
  status: z.nativeEnum(PostStatus).optional().default(PostStatus.draft),
  title: z.string().min(1).max(255),
});

export const UpdatePostBodySchema = CreatePostBodySchema.partial();

export const IndexPostsQuerySchema = z.object({
  authorId: z.string().uuid().optional(),
  orderBy: z.enum(['createdAt', 'reactionsCount']).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.nativeEnum(PostStatus).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  tagSlug: z.string().optional(),
});

export const PostParamsSchema = z.object({
  postId: z.string().uuid(),
});

export type CreatePostBody = z.infer<typeof CreatePostBodySchema>;
export type IndexPostsQuery = z.infer<typeof IndexPostsQuerySchema>;
export type PostParams = z.infer<typeof PostParamsSchema>;
export type UpdatePostBody = z.infer<typeof UpdatePostBodySchema>;
