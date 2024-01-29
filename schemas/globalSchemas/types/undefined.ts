import { z } from "zod";

export const CustomUndefinedSchema = z.union([
  z.undefined(),
  z.string().transform((val: string, ctx): undefined => {
    if (val === "undefined") {
      return undefined;
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        received: val,
        options: ["undefined"],
      });

      return z.NEVER;
    }
  }),
]);
