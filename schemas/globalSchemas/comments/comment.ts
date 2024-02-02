import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { CommentCountSchema } from "~/schemas/globalSchemas/comments/commentCount";
import { CommentAuthSchema } from "~/schemas/globalSchemas/comments/commentAuth";

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

export const CommentFullSchema = CommentSchema.merge(
  z.object({
    user: UserSchema,
  }),
)
  .merge(CommentCountSchema)
  .merge(CommentAuthSchema);

export type CommentFull = z.infer<typeof CommentFullSchema>;
