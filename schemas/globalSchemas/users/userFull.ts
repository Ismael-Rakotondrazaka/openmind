import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users/user";
import { TagSchema } from "~/schemas/globalSchemas/tags/tag";
import { UserCountSchema } from "~/schemas/globalSchemas/users/userCount";
import { UserAuthSchema } from "~/schemas/globalSchemas/users/userAuth";

export const UserFullSchema = UserSchema.merge(
  z.object({
    tags: z.array(TagSchema),
  }),
)
  .merge(UserCountSchema)
  .merge(UserAuthSchema);

export type UserFull = z.infer<typeof UserFullSchema>;
