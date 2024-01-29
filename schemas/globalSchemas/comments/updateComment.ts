import { z } from "zod";
import { commentConfig } from "~/configs";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { makeContentClientSchema } from "~/schemas/globalSchemas/contents";
import { CommentSchema } from "~/schemas/globalSchemas/comments/comment";
import { CommentCountSchema } from "~/schemas/globalSchemas/comments/commentCount";
import { CommentAuthSchema } from "~/schemas/globalSchemas/comments/commentAuth";

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
  )
    .and(CommentCountSchema)
    .and(CommentAuthSchema),
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
