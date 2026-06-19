import { z } from 'zod';

export const UpdateProfileBodySchema = z.object({
  firstName: z.string().min(1).max(100).nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  lastName: z.string().min(1).max(100).nullable().optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[\w-]+$/)
    .nullable()
    .optional(),
});

export const IndexUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  role: z.enum(['admin', 'moderator', 'user']).optional(),
  search: z.string().optional(),
  username: z.string().optional(),
});

export const UserParamsSchema = z.object({
  userId: z.string().uuid(),
});

export const UsernameExistsQuerySchema = z.object({
  username: z.string().min(1),
});

export type IndexUsersQuery = z.infer<typeof IndexUsersQuerySchema>;
export type UpdateProfileBody = z.infer<typeof UpdateProfileBodySchema>;
export type UsernameExistsQuery = z.infer<typeof UsernameExistsQuerySchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
