import { z } from 'zod';

export const CreatePostSchema = z.object({
  content: z.any(),
  coverUrl: z.string().url().nullish(),
  existingTags: z.array(z.string().uuid()),
  newTags: z.array(z.string().min(1)),
  title: z.string().min(1),
});

export type CreatePost = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z.object({
  content: z.any(),
  coverUrl: z.string().url().nullish(),
  tags: z.array(z.string().min(1)),
  title: z.string().min(1),
});

export type UpdatePost = z.infer<typeof UpdatePostSchema>;
