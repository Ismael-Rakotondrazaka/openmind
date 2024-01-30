import { z } from "zod";
import { CommentFullSchema } from "~/schemas/globalSchemas/comments/comment";

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
  comment: CommentFullSchema,
});

export type DestroyCommentData = z.infer<typeof DestroyCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy comment error                           */
/* -------------------------------------------------------------------------- */

export type DestroyCommentError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
