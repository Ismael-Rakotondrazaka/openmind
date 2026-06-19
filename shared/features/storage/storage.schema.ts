import { z } from 'zod';

import { PostConfig } from '../posts/post.config';
import { UserConfig } from '../users/user.config';

export const PresignBodySchema = z.object({
  contentType: z.enum(['image/gif', 'image/jpeg', 'image/png', 'image/webp']),
  fileName: z.string().min(1).default('file'),
});

export type PresignBody = z.infer<typeof PresignBodySchema>;

export const PresignDocumentBodySchema = z.object({
  contentType: z.enum([
    'application/pdf',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
  ]),
  fileName: z.string().min(1).default('document'),
});

export type PresignDocumentBody = z.infer<typeof PresignDocumentBodySchema>;

export const PostFileParamsSchema = z.object({
  postId: z.string().uuid(),
});

export type PostFileParams = z.infer<typeof PostFileParamsSchema>;

export const UserAvatarParamsSchema = z.object({
  userId: z.string().uuid(),
});

export type UserAvatarParams = z.infer<typeof UserAvatarParamsSchema>;

export const SignedUrlQuerySchema = z.object({
  bucket: z.enum([
    PostConfig.COVERS_BUCKET,
    PostConfig.FILES_BUCKET,
    UserConfig.AVATARS_BUCKET,
  ]),
  path: z.string().min(1),
});

export type SignedUrlQuery = z.infer<typeof SignedUrlQuerySchema>;
