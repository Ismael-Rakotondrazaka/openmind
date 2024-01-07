import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z
  .object({
    equals: z.coerce.number().optional(),
    in: z.coerce.number().array().optional(),
    notIn: z.coerce.number().array().optional(),
    lt: z.coerce.number().optional(),
    lte: z.coerce.number().optional(),
    gt: z.coerce.number().optional(),
    gte: z.coerce.number().optional(),
    not: z
      .union([z.coerce.number(), z.lazy(() => NestedIntFilterSchema)])
      .optional(),
  })
  .strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z
  .object({
    equals: z.coerce.number().optional(),
    in: z.coerce.number().array().optional(),
    notIn: z.coerce.number().array().optional(),
    lt: z.coerce.number().optional(),
    lte: z.coerce.number().optional(),
    gt: z.coerce.number().optional(),
    gte: z.coerce.number().optional(),
    not: z
      .union([z.coerce.number(), z.lazy(() => NestedIntFilterSchema)])
      .optional(),
  })
  .strict();
