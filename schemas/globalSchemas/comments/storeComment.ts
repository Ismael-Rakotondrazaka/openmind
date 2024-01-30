import { z } from "zod";
import { CommentFullSchema } from "~/schemas/globalSchemas/comments/comment";

import { commentConfig } from "~/configs";
import { makeContentClientSchema } from "~/schemas/globalSchemas/contents";
import { CustomNullSchema } from "~/schemas/globalSchemas/types";

/* -------------------------------------------------------------------------- */
/*                             Store comment body                             */
/* -------------------------------------------------------------------------- */

export const StoreCommentBodyBaseSchema = z.object({
  parentId: z.union([z.string(), CustomNullSchema]).optional(),
  articleId: z.string(),
});

export const StoreCommentBodyClientSchema = StoreCommentBodyBaseSchema.merge(
  z.object({
    content: makeContentClientSchema(
      commentConfig.CONTENT_MIN_LENGTH,
      commentConfig.CONTENT_MAX_LENGTH,
    ),
  }),
);

export type StoreCommentBody = z.infer<typeof StoreCommentBodyClientSchema>;

export type StoreCommentBodyPEM = RequestErrorMessage<StoreCommentBody>;

/* -------------------------------------------------------------------------- */
/*                             Store comment data                             */
/* -------------------------------------------------------------------------- */

export const StoreCommentDataSchema = z.object({
  comment: CommentFullSchema,
});

export type StoreCommentData = z.infer<typeof StoreCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Store comment error                            */
/* -------------------------------------------------------------------------- */

export type StoreCommentError =
  | BadRequestError<StoreCommentBodyPEM>
  | UnauthorizedError;
