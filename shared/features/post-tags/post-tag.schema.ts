import { z } from 'zod';

export const PostTagQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  postId: z.string().uuid().optional(),
  tagId: z.string().uuid().optional(),
});

export const PostTagParamsSchema = z.object({
  postId: z.string().uuid(),
  tagId: z.string().uuid(),
});

export const CreatePostTagBodySchema = z.object({
  postId: z.string().uuid(),
  tagId: z.string().uuid(),
});

export type CreatePostTagBody = z.infer<typeof CreatePostTagBodySchema>;
export type PostTagParams = z.infer<typeof PostTagParamsSchema>;
export type PostTagQuery = z.infer<typeof PostTagQuerySchema>;
