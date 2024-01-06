import type { Article, User } from "@prisma/client";
import { z } from "zod";
import { articleConfig } from "~/utils/configs";
import { countHtmlAsTextLength } from "~/utils/strings";
import { articleSchema } from "~/utils/requests/articles/model";
import { userSchema } from "~/utils/requests/users/model";

/* -------------------------------------------------------------------------- */
/*                            Update article param                            */
/* -------------------------------------------------------------------------- */

export const updateArticleParamSchema = z.object({
  slug: z.string().trim(),
});

export type UpdateArticleParam = z.infer<typeof updateArticleParamSchema>;

/* -------------------------------------------------------------------------- */
/*                             Update article body                            */
/* -------------------------------------------------------------------------- */

export const updateArticleBodyBaseSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(articleConfig.TITLE_MIN_LENGTH)
      .max(articleConfig.TITLE_MAX_LENGTH),
    summary: z
      .string()
      .trim()
      .nullable()
      .optional()
      .transform((value: string | null | undefined, ctx) => {
        if (typeof value === "string") {
          if (value === "") {
            return null;
          } else if (value.length < articleConfig.SUMMARY_MIN_LENGTH) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: articleConfig.SUMMARY_MIN_LENGTH,
              inclusive: true,
              type: "string",
            });

            return z.NEVER;
          } else if (value.length > articleConfig.SUMMARY_MAX_LENGTH) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              maximum: articleConfig.SUMMARY_MIN_LENGTH,
              inclusive: true,
              type: "string",
            });

            return z.NEVER;
          }
        }

        return value;
      }),
    isVisible: z.boolean().default(articleConfig.IS_VISIBLE_DEFAULT_VALUE),
  })
  .partial();

export const updateArticleBodyClientSchema = updateArticleBodyBaseSchema.merge(
  z
    .object({
      content: z
        .string()
        .trim()
        .superRefine((value: string, ctx) => {
          const parser = new DOMParser();
          const document = parser.parseFromString(value, "text/html");
          const body = document.body;

          const length: number = countHtmlAsTextLength(body);

          if (length < articleConfig.CONTENT_MIN_LENGTH) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: articleConfig.CONTENT_MIN_LENGTH,
              inclusive: true,
              fatal: true,
              type: "string",
            });

            return z.NEVER;
          }

          if (length > articleConfig.CONTENT_MAX_LENGTH) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              fatal: true,
              maximum: articleConfig.CONTENT_MAX_LENGTH,
              inclusive: true,
              type: "string",
            });

            return z.NEVER;
          }
        }),
    })
    .partial(),
);

export type UpdateArticleBody = z.infer<typeof updateArticleBodyClientSchema>;

export type UpdateArticleBodyPEM = RequestErrorMessage<UpdateArticleBody>;

/* -------------------------------------------------------------------------- */
/*                             Update article data                            */
/* -------------------------------------------------------------------------- */

export const updateArticleDataSchema = z.object({
  article: articleSchema.and(
    z.object({
      user: userSchema,
    }),
  ),
});

export type UpdateArticleData = {
  article: Article & {
    user: Omit<User, "password" | "email" | "emailVerifiedAt">;
  };
};

export type UpdateArticleError =
  | BadRequestError<UpdateArticleBodyPEM>
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;
