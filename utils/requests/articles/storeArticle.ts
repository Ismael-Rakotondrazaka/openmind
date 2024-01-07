import type { Article, User } from "@prisma/client";
import { z } from "zod";
import { articleConfig } from "~/utils/configs";
import { countHtmlAsTextLength } from "~/utils/strings";

export const StoreArticleBodyBaseSchema = z.object({
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
});

export const StoreArticleBodyClientSchema = StoreArticleBodyBaseSchema.merge(
  z.object({
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
  }),
);

export type StoreArticleBody = z.infer<typeof StoreArticleBodyClientSchema>;

export type StoreArticleBodyPEM = RequestErrorMessage<StoreArticleBody>;

export type StoreArticleData = {
  article: Article & {
    user: Omit<User, "password" | "email" | "emailVerifiedAt">;
  };
};

export type StoreArticleError =
  | BadRequestError<StoreArticleBodyPEM>
  | UnauthorizedError;
