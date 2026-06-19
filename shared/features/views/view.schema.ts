import { z } from 'zod';

export const RecordViewBodySchema = z.object({
  postId: z.string().uuid(),
});

export type RecordViewBody = z.infer<typeof RecordViewBodySchema>;
