import type { Article, Tag, User } from "@prisma/client";
import { z } from "zod";
import { articleConfig } from "~/utils/configs";
import { countHtmlAsTextLength } from "~/utils/strings";
import {
  CustomBooleanSchema,
  FileSchema,
  CustomNullSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                             Store article body                             */
/* -------------------------------------------------------------------------- */

export const StoreArticleBodyBaseSchema = z.object({
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
        if (typeof value === "string") {
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
        }

        return value;
      })
      .optional(),
  ]),
  isVisible: CustomBooleanSchema.default(
    articleConfig.IS_VISIBLE_DEFAULT_VALUE,
  ),
  tagIds: z
    .array(z.coerce.number().int().positive())
    .min(1)
    .max(articleConfig.TAGS_MAX_SIZE)
    .refine((val: number[]) => val.length === [...new Set(val)].length, {
      message: "Tags must be unique",
    }),
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
    cover: z.union([FileSchema, CustomNullSchema]).optional(),
  }),
);

export type StoreArticleBody = z.infer<typeof StoreArticleBodyClientSchema>;

export type StoreArticleBodyPEM = RequestErrorMessage<StoreArticleBody>;

/* -------------------------------------------------------------------------- */
/*                             Store article data                             */
/* -------------------------------------------------------------------------- */

export type StoreArticleData = {
  article: Article & {
    user: Omit<User, "password" | "email" | "emailVerifiedAt">;
  } & {
    tags: Tag[];
  };
};

/* -------------------------------------------------------------------------- */
/*                             Store article error                            */
/* -------------------------------------------------------------------------- */

export type StoreArticleError =
  | BadRequestError<StoreArticleBodyPEM>
  | UnauthorizedError;
