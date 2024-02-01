import { z } from "zod";
import { ViewSchema } from "~/schemas/globalSchemas/views/view";
import { UserSchema } from "~/schemas/globalSchemas/users/user";

export const ViewFullSchema = ViewSchema.and(
  z.object({
    user: UserSchema,
  }),
);

export type ViewFull = z.infer<typeof ViewFullSchema>;
