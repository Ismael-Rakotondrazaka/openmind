import { z } from "zod";
import { ViewSchema } from "~/prisma/generated/zod";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users/user";

export const ViewFullSchema = ViewSchema.and(
  z.object({
    user: UserFilteredSchema,
  }),
);

export type ViewFull = z.infer<typeof ViewFullSchema>;
