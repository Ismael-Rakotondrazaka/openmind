import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { SortOrderSchema } from "~/schemas/globalSchemas/types";

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    username: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    firstName: z.lazy(() => SortOrderSchema).optional(),
    createdAt: z.lazy(() => SortOrderSchema).optional(),
    updatedAt: z.lazy(() => SortOrderSchema).optional(),
  });
