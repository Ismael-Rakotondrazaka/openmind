import type { Article, User } from "@prisma/client";
import { z } from "zod";
import { articleConfig } from "~/utils/configs";
import { countHtmlAsTextLength } from "~/utils/strings";
import { ArticleSchema } from "~/utils/schemas/articles";
import { UserSchema } from "~/utils/schemas/users";
import {
  CustomBooleanSchema,
  FileSchema,
  CustomNullSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                            Update article param                            */
/* -------------------------------------------------------------------------- */

export const UpdateArticleParamSchema = z.object({
  slug: z.string().trim(),
});

export type UpdateArticleParam = z.infer<typeof UpdateArticleParamSchema>;

/* -------------------------------------------------------------------------- */
/*                             Update article body                            */
/* -------------------------------------------------------------------------- */

export const UpdateArticleBodyBaseSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(articleConfig.TITLE_MIN_LENGTH)
      .max(articleConfig.TITLE_MAX_LENGTH),
    summary: z.union([
      CustomNullSchema,
      z
        .string()
        .trim()
        .transform((value: string, ctx): string => {
          if (value.length < articleConfig.SUMMARY_MIN_LENGTH) {
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

          return value;
        }),
    ]),
    isVisible: CustomBooleanSchema.default(
      articleConfig.IS_VISIBLE_DEFAULT_VALUE,
    ),
  })
  .partial();

export const UpdateArticleBodyClientSchema = UpdateArticleBodyBaseSchema.merge(
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
      cover: z.union([FileSchema, CustomNullSchema]),
    })
    .partial(),
);

export type UpdateArticleBody = z.infer<typeof UpdateArticleBodyClientSchema>;

export type UpdateArticleBodyPEM = RequestErrorMessage<UpdateArticleBody>;

/* -------------------------------------------------------------------------- */
/*                             Update article data                            */
/* -------------------------------------------------------------------------- */

export const UpdateArticleDataSchema = z.object({
  article: ArticleSchema.and(
    z.object({
      user: UserSchema,
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
