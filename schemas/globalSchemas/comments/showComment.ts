import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { CommentSchema } from "~/schemas/globalSchemas/comments/comment";
import { CommentCountSchema } from "~/schemas/globalSchemas/comments/commentCount";
import { CommentAuthSchema } from "~/schemas/globalSchemas/comments/commentAuth";

/* -------------------------------------------------------------------------- */
/*                             Show comment param                             */
/* -------------------------------------------------------------------------- */

export const ShowCommentParamSchema = z.object({
  id: z.string().trim(),
});

export type ShowCommentParam = z.infer<typeof ShowCommentParamSchema>;

/* -------------------------------------------------------------------------- */
/*                              Show comment data                             */
/* -------------------------------------------------------------------------- */

export const ShowCommentDataSchema = z.object({
  comment: CommentSchema.and(
    z.object({
      user: UserSchema,
    }),
  )
    .and(CommentCountSchema)
    .and(CommentAuthSchema),
});

export type ShowCommentData = z.infer<typeof ShowCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Show comment error                             */
/* -------------------------------------------------------------------------- */

export type ShowCommentError = NotFoundError;
