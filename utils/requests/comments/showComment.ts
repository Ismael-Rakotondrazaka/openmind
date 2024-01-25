import { z } from "zod";
import {
  UserSchema,
  CommentSchema,
  CommentCountSchema,
  CommentAuthSchema,
} from "~/utils/schemas";

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
