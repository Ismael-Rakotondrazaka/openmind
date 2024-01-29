import { z } from "zod";
import {
  userProfileConfig,
  UpdateUserBodyBaseSchema,
  CustomNullSchema,
} from "~/utils";

/* -------------------------------------------------------------------------- */
/*                              Update user body                              */
/* -------------------------------------------------------------------------- */

export const UpdateUserBodySchema = UpdateUserBodyBaseSchema.merge(
  z
    .object({
      profile: z.union([
        makeSafeFileSchema(
          userProfileConfig.MAX_SIZE,
          userProfileConfig.MIME_TYPES,
        ),
        CustomNullSchema,
      ]),
    })
    .partial(),
);
