import { z } from "zod";
import { JSDOM } from "jsdom";
import {
  countHtmlAsTextLength,
  articleConfig,
  updateArticleBodyBaseSchema,
} from "~/utils";

export const updateArticleBodySchema = updateArticleBodyBaseSchema.merge(
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
    })
    .partial(),
);
