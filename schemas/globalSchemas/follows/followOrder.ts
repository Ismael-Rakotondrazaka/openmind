import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { UserOrderByWithRelationInputSchema } from "~/schemas/globalSchemas/users/userOrder";

export const FollowOrderByWithRelationInputSchema: z.ZodType<Prisma.FollowOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    followerId: z.lazy(() => SortOrderSchema).optional(),
    followingId: z.lazy(() => SortOrderSchema).optional(),
    follower: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
    following: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  });
