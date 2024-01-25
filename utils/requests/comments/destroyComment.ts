import { z } from "zod";
import {
  CommentSchema,
  UserSchema,
  CommentCountSchema,
  CommentAuthSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                            Destroy comment param                           */
/* -------------------------------------------------------------------------- */

export const DestroyCommentParamSchema = z.object({
  id: z.string().trim(),
});

export type DestroyCommentParam = z.infer<typeof DestroyCommentParamSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy comment data                            */
/* -------------------------------------------------------------------------- */

export const DestroyCommentDataSchema = z.object({
  comment: CommentSchema.and(
    z.object({
      user: UserSchema,
    }),
  )
    .and(CommentCountSchema)
    .and(CommentAuthSchema),
});

export type DestroyCommentData = z.infer<typeof DestroyCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy comment error                           */
/* -------------------------------------------------------------------------- */

export type DestroyCommentError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
