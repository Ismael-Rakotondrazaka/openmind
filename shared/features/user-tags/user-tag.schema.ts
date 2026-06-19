import { z } from 'zod';

export const UserTagQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  tagId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export const UserTagParamsSchema = z.object({
  tagId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const CreateUserTagBodySchema = z.object({
  tagId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const UpdateUserTagBodySchema = z.object({
  order: z.number().int().optional(),
});

export type CreateUserTagBody = z.infer<typeof CreateUserTagBodySchema>;
export type UpdateUserTagBody = z.infer<typeof UpdateUserTagBodySchema>;
export type UserTagParams = z.infer<typeof UserTagParamsSchema>;
export type UserTagQuery = z.infer<typeof UserTagQuerySchema>;
