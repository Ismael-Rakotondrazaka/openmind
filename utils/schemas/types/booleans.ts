import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> =
  z.object({
    equals: z.boolean().optional(),
    not: z
      .union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)])
      .optional(),
  });

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
