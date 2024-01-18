import { z } from "zod";
import { commentConfig } from "~/utils/configs";
import {
  CustomNullSchema,
  UserSchema,
  CommentSchema,
  makeContentClientSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                             Store comment body                             */
/* -------------------------------------------------------------------------- */

export const StoreCommentBodyBaseSchema = z.object({
  parentId: z.union([z.coerce.number().int().positive(), CustomNullSchema]),
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
  comment: CommentSchema.and(
    z.object({
      user: UserSchema,
    }),
  ),
});

export type StoreCommentData = z.infer<typeof StoreCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Store comment error                            */
/* -------------------------------------------------------------------------- */

export type StoreCommentError =
  | BadRequestError<StoreCommentBodyPEM>
  | UnauthorizedError;
