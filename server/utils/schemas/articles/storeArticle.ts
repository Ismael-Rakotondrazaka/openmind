import { z } from "zod";
import { JSDOM } from "jsdom";
import {
  StoreArticleBodyBaseSchema,
  articleConfig,
  articleImageConfig,
  countHtmlAsTextLength,
} from "~/utils";

export const StoreArticleBodySchema = StoreArticleBodyBaseSchema.merge(
  z.object({
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
    cover: makeSafeFileSchema(
      articleImageConfig.MAX_SIZE,
      articleImageConfig.MIME_TYPES,
    ).optional(),
  }),
);
