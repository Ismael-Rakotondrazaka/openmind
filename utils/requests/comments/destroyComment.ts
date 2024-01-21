import { z } from "zod";
import { CommentSchema, UserSchema } from "~/utils/schemas";

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
  ).and(
    z.object({
      _count: z.object({
        replies: z.coerce.number().positive().int(),
      }),
    }),
  ),
});

export type DestroyCommentData = z.infer<typeof DestroyCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy comment error                           */
/* -------------------------------------------------------------------------- */

export type DestroyCommentError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
