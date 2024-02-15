import { z } from "zod";
import { JSDOM } from "jsdom";
import {
  StoreArticleBodyBaseSchema,
  articleConfig,
  articleImageConfig,
  countHtmlAsTextLength,
  CustomNullSchema,
  CustomBooleanSchema,
} from "~/utils";

/* -------------------------------------------------------------------------- */
/*                             Store article body                             */
/* -------------------------------------------------------------------------- */

export const StoreArticleBodySchema = StoreArticleBodyBaseSchema.merge(
  z.object({
    isVisible: CustomBooleanSchema.default(
      articleConfig.IS_VISIBLE_DEFAULT_VALUE,
    ),
    summary: z.union([
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
      CustomNullSchema,
    ]),
    content: z
      .string()
      .trim()
      .superRefine((value: string, ctx) => {
        const dom = new JSDOM(value);

        const length: number = countHtmlAsTextLength(dom.window.document.body);

        if (length < articleConfig.CONTENT_MIN_LENGTH) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Content is too short",
            fatal: true,
          });

          return z.NEVER;
        }

        if (length > articleConfig.CONTENT_MAX_LENGTH) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Content is too long",
            fatal: true,
          });

          return z.NEVER;
        }
      }),
    cover: z
      .union([
        makeSafeFileSchema(
          articleImageConfig.MAX_SIZE,
          articleImageConfig.MIME_TYPES,
        ),
        CustomNullSchema,
      ])
      .optional(),
    tagIds: z.union([
      z
        .array(z.coerce.number().int().positive())
        .min(1)
        .max(articleConfig.TAGS_MAX_SIZE)
        .refine((val: number[]) => val.length === [...new Set(val)].length, {
          message: "Tags must be unique",
        }),
      z.coerce
        .number()
        .int()
        .positive()
        .transform((val: number): number[] => [val]),
    ]),
  }),
);
