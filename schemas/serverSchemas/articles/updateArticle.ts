import { z } from "zod";
import { JSDOM } from "jsdom";
import {
  UpdateArticleBodyBaseSchema,
  CustomNullSchema,
  CustomBooleanSchema,
} from "~/schemas/globalSchemas";
import { articleConfig, articleImageConfig } from "~/configs";
import { countHtmlAsTextLength } from "~/utils/strings";

/* -------------------------------------------------------------------------- */
/*                             Update article body                            */
/* -------------------------------------------------------------------------- */

export const UpdateArticleBodySchema = UpdateArticleBodyBaseSchema.merge(
  z
    .object({
      content: z
        .string()
        .trim()
        .superRefine((value: string, ctx) => {
          const dom = new JSDOM(value);

          const length: number = countHtmlAsTextLength(
            dom.window.document.body,
          );

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
      cover: z.union([
        makeSafeFileSchema(
          articleImageConfig.MAX_SIZE,
          articleImageConfig.MIME_TYPES,
        ),
        CustomNullSchema,
      ]),
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
    })
    .partial(),
);
