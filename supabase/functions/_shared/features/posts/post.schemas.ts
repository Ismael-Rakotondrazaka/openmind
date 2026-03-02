import { z } from 'zod';

export const AnalyzePostBodySchema = z.object({
  postId: z.uuid('postId must be a valid UUID'),
});

export type AnalyzePostBody = z.infer<typeof AnalyzePostBodySchema>;
