import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { FollowWhereInputSchema } from "~/schemas/globalSchemas/follows/followWhere";

export const FollowListRelationFilterSchema: z.ZodType<Prisma.FollowListRelationFilter> =
  z.object({
    every: z.lazy(() => FollowWhereInputSchema).optional(),
    some: z.lazy(() => FollowWhereInputSchema).optional(),
    none: z.lazy(() => FollowWhereInputSchema).optional(),
  });
