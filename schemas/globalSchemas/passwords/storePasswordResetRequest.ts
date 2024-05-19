import { z } from "zod";
import { userConfig } from "@/configs";

/* -------------------------------------------------------------------------- */
/*                          Store Password Reset Request Body                         */
/* -------------------------------------------------------------------------- */

export const StorePasswordResetRequestBodySchema = z.object({
  emailOrUsername: z
    .string()
    .min(0)
    .max(Math.max(userConfig.USERNAME_MAX_LENGTH, userConfig.EMAIL_MAX_LENGTH)),
});

export type StorePasswordResetRequestBody = z.infer<
  typeof StorePasswordResetRequestBodySchema
>;

export type StorePasswordResetRequestBodyPEM =
  RequestErrorMessage<StorePasswordResetRequestBody>;

/* -------------------------------------------------------------------------- */
/*                          Store Password Reset Request Data                         */
/* -------------------------------------------------------------------------- */

export type StorePasswordResetRequestData = {
  message: string;
};

/* -------------------------------------------------------------------------- */
/*                         Store Password Reset Request Error                         */
/* -------------------------------------------------------------------------- */

export type StorePasswordResetRequestError =
  BadRequestError<StorePasswordResetRequestBodyPEM>;
