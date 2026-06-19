import { z } from 'zod';

export const CreateTagBodySchema = z.object({
  value: z.string().min(1).max(50),
});

export const IndexTagsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
});

export const TagParamsSchema = z.object({
  tagId: z.string().uuid(),
});

export type CreateTagBody = z.infer<typeof CreateTagBodySchema>;
export type IndexTagsQuery = z.infer<typeof IndexTagsQuerySchema>;
export type TagParams = z.infer<typeof TagParamsSchema>;
