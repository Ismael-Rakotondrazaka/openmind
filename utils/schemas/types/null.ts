import { z } from "zod";

export const CustomNullSchema = z.union([
  z.null(),
  z.string().transform((val: string, ctx): null => {
    if (val === "null") {
      return null;
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        received: val,
        options: ["null"],
      });

      return z.NEVER;
    }
  }),
]);
