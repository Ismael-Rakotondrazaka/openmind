import type { OutputData } from '@editorjs/editorjs';

import { z } from 'zod';

import { SortOrderSchema } from '../../utils/enums';

export const CreateCommentBodySchema = z.object({
  content: z.custom<OutputData>(),
  parentId: z.string().uuid().nullable().optional(),
  postId: z.string().uuid(),
});

export const UpdateCommentBodySchema = z.object({
  content: z.custom<OutputData>(),
});

export const IndexCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  parentId: z.string().uuid().nullable().optional(),
  postId: z.string().uuid(),
  sortOrder: SortOrderSchema.optional(),
});

export const CommentParamsSchema = z.object({
  commentId: z.string().uuid(),
});

export type CommentParams = z.infer<typeof CommentParamsSchema>;
export type CreateCommentBody = z.infer<typeof CreateCommentBodySchema>;
export type IndexCommentsQuery = z.infer<typeof IndexCommentsQuerySchema>;
export type UpdateCommentBody = z.infer<typeof UpdateCommentBodySchema>;
