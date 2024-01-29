import { z } from "zod";

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().nullable(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type Comment = z.infer<typeof CommentSchema>;
