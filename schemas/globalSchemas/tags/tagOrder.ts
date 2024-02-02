import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { SortOrderSchema } from "~/schemas/globalSchemas/types";

export const TagOrderByWithRelationInputSchema: z.ZodType<Prisma.TagOrderByWithRelationInput> =
  z.object({
    id: z.lazy(() => SortOrderSchema).optional(),
    value: z.lazy(() => SortOrderSchema).optional(),
  });
