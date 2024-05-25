import { z } from "zod";

export const CustomBooleanSchema = z.union([
  z.boolean(),
  z.string().transform((val: string, ctx): boolean => {
    if (val === "true") {
      return true;
    } else if (val === "false") {
      return false;
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        received: val,
        options: ["true", "false"],
      });

      return z.NEVER;
    }
  }),
]);
