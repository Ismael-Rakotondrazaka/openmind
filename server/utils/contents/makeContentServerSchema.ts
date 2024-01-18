import { z } from "zod";
import { JSDOM } from "jsdom";
import { countHtmlAsTextLength } from "~/utils/strings";

export const makeContentServerSchema = (minLength: number, maxLength: number) =>
  z
    .string()
    .trim()
    .superRefine((value: string, ctx) => {
      const dom = new JSDOM(value);

      const length: number = countHtmlAsTextLength(dom.window.document.body);

      if (length < minLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: minLength,
          inclusive: true,
          fatal: true,
          type: "string",
        });

        return z.NEVER;
      }

      if (length > maxLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          fatal: true,
          maximum: maxLength,
          inclusive: true,
          type: "string",
        });

        return z.NEVER;
      }
    });
