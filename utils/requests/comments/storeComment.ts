import { z } from "zod";
import { commentConfig } from "~/utils/configs";
import { countHtmlAsTextLength } from "~/utils/strings";
import { CustomNullSchema, UserSchema, CommentSchema } from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                             Store comment body                             */
/* -------------------------------------------------------------------------- */

export const StoreCommentBodyBaseSchema = z.object({
  parentId: z.union([z.coerce.number().int().positive(), CustomNullSchema]),
  articleId: z.coerce.number().int().positive(),
});

export const StoreCommentBodyClientSchema = StoreCommentBodyBaseSchema.merge(
  z.object({
    content: z
      .string()
      .trim()
      .superRefine((value: string, ctx) => {
        const parser = new DOMParser();
        const document = parser.parseFromString(value, "text/html");
        const body = document.body;

        const length: number = countHtmlAsTextLength(body);

        if (length < commentConfig.CONTENT_MIN_LENGTH) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: commentConfig.CONTENT_MIN_LENGTH,
            inclusive: true,
            fatal: true,
            type: "string",
          });

          return z.NEVER;
        }

        if (length > commentConfig.CONTENT_MAX_LENGTH) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            fatal: true,
            maximum: commentConfig.CONTENT_MAX_LENGTH,
            inclusive: true,
            type: "string",
          });

          return z.NEVER;
        }
      }),
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
