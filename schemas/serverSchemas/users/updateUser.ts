import { z } from "zod";
import {
  UpdateUserBodyBaseSchema,
  CustomNullSchema,
} from "~/schemas/globalSchemas";
import { userProfileConfig } from "~/configs";

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
