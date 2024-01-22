import { z } from "zod";
import { commentConfig } from "~/utils/configs";
import {
  UserSchema,
  makeContentClientSchema,
  CommentSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                            Update comment param                            */
/* -------------------------------------------------------------------------- */

export const UpdateCommentParamSchema = z.object({
  id: z.string().trim(),
});

export type UpdateCommentParam = z.infer<typeof UpdateCommentParamSchema>;

/* -------------------------------------------------------------------------- */
/*                             Update comment body                            */
/* -------------------------------------------------------------------------- */

export const UpdateCommentBodyClientSchema = z
  .object({
    content: makeContentClientSchema(
      commentConfig.CONTENT_MIN_LENGTH,
      commentConfig.CONTENT_MAX_LENGTH,
    ),
  })
  .partial();

export type UpdateCommentBody = z.infer<typeof UpdateCommentBodyClientSchema>;

export type UpdateCommentBodyPEM = RequestErrorMessage<UpdateCommentBody>;

/* -------------------------------------------------------------------------- */
/*                             Update comment data                            */
/* -------------------------------------------------------------------------- */

export const UpdateCommentDataSchema = z.object({
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

export type UpdateCommentData = z.infer<typeof UpdateCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Update comment error                            */
/* -------------------------------------------------------------------------- */

export type UpdateCommentError =
  | BadRequestError<UpdateCommentBodyPEM>
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;