import { z } from "zod";
import { TagSchema } from "~/prisma/generated/zod";
import { UserCountSchema } from "~/schemas/globalSchemas/users/userCount";
import { UserAuthSchema } from "~/schemas/globalSchemas/users/userAuth";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users/user";

export const UserFullSchema = UserFilteredSchema.merge(
  z.object({
    tags: z.array(TagSchema),
  }),
)
  .merge(UserCountSchema)
  .merge(UserAuthSchema);

export type UserFull = z.infer<typeof UserFullSchema>;
