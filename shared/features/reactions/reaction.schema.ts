import { z } from 'zod';

import { ReactionType } from './reaction.model';

export const ToggleReactionBodySchema = z.object({
  commentId: z.string().uuid().nullable().optional(),
  postId: z.string().uuid().nullable().optional(),
  type: z.nativeEnum(ReactionType),
});

export const IndexReactionsQuerySchema = z.object({
  commentId: z.string().uuid().optional(),
  excludeUserId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  postId: z.string().uuid().optional(),
  type: z.nativeEnum(ReactionType).optional(),
  userId: z.string().uuid().optional(),
});

export type IndexReactionsQuery = z.infer<typeof IndexReactionsQuerySchema>;
export type ToggleReactionBody = z.infer<typeof ToggleReactionBodySchema>;
