import { z } from "zod";
import { commentConfig } from "~/configs";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { makeContentClientSchema } from "~/schemas/globalSchemas/contents";
import { CommentSchema } from "~/schemas/globalSchemas/comments/comment";
import { CommentCountSchema } from "~/schemas/globalSchemas/comments/commentCount";
import { CommentAuthSchema } from "~/schemas/globalSchemas/comments/commentAuth";
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
  comment: CommentSchema.and(
    z.object({
      user: UserSchema,
    }),
  )
    .and(CommentCountSchema)
    .and(CommentAuthSchema),
});

export type StoreCommentData = z.infer<typeof StoreCommentDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Store comment error                            */
/* -------------------------------------------------------------------------- */

export type StoreCommentError =
  | BadRequestError<StoreCommentBodyPEM>
  | UnauthorizedError;
