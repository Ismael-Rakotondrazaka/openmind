import { z } from "zod";
import { userConfig } from "~/configs";
import {
  FileSchema,
  CustomNullSchema,
  TagSchema,
  UserSchema,
  UserCountSchema,
  UserAuthSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                              Update user param                             */
/* -------------------------------------------------------------------------- */

export const UpdateUserParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type UpdateUserParam = z.infer<typeof UpdateUserParamSchema>;

/* -------------------------------------------------------------------------- */
/*                              Update user body                              */
/* -------------------------------------------------------------------------- */

export const UpdateUserBodyBaseSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(userConfig.NAME_MIN_LENGTH)
      .max(userConfig.NAME_MAX_LENGTH),
    firstName: z
      .string()
      .trim()
      .min(userConfig.FIRST_NAME_MIN_LENGTH)
      .max(userConfig.FIRST_NAME_MAX_LENGTH),
  })
  .partial();

export const UpdateUserBodyClientSchema = UpdateUserBodyBaseSchema.merge(
  z
    .object({
      profile: z.union([FileSchema, CustomNullSchema]),
    })
    .partial(),
);

export type UpdateUserBody = z.infer<typeof UpdateUserBodyClientSchema>;

export type UpdateUserBodyPEM = RequestErrorMessage<UpdateUserBody>;

/* -------------------------------------------------------------------------- */
/*                              Update user data                              */
/* -------------------------------------------------------------------------- */

export const UpdateUserDataSchema = z.object({
  user: UserSchema.and(
    z.object({
      tags: z.array(TagSchema),
    }),
  )
    .and(UserCountSchema)
    .and(UserAuthSchema),
});

export type UpdateUserData = z.infer<typeof UpdateUserDataSchema>;

export type UpdateUserError =
  | BadRequestError<UpdateUserBodyPEM>
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;
