import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> =
  z.object({
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
  });

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
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
});

// @ts-ignore
export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> =
  z.object({
    equals: z.number().optional().nullable(),
    in: z.number().array().optional().nullable(),
    notIn: z.number().array().optional().nullable(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
      .optional()
      .nullable(),
  });

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> =
  z.object({
    equals: z.number().optional().nullable(),
    in: z.number().array().optional().nullable(),
    notIn: z.number().array().optional().nullable(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
      .optional()
      .nullable(),
  });
