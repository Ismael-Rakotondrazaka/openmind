import { z } from "zod";
import { CommentFullSchema } from "~/schemas/globalSchemas/comments/comment";

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
  comment: CommentFullSchema,
});

export type ShowCommentData = z.infer<typeof ShowCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Show comment error                             */
/* -------------------------------------------------------------------------- */

export type ShowCommentError = NotFoundError;
