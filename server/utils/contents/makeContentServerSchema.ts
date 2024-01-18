import { z } from "zod";
import { countHtmlAsTextLength } from "~/utils/strings";

export const makeContentServerSchema = (minLength: number, maxLength: number) =>
  z
    .string()
    .trim()
    .superRefine((value: string, ctx) => {
      const parser = new DOMParser();
      const document = parser.parseFromString(value, "text/html");
      const body = document.body;

      const length: number = countHtmlAsTextLength(body);

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
