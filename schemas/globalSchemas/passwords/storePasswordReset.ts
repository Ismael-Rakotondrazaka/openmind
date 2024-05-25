import { passwordConfig } from "@/configs";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                          Store Password Reset Body                         */
/* -------------------------------------------------------------------------- */

export const StorePasswordResetBodySchema = z.object({
  t: z.string().length(passwordConfig.PASSWORD_RESET_TOKEN_SIZE),
  password: z.string().min(passwordConfig.PASSWORD_MIN_LENGTH),
});

export type StorePasswordResetBody = z.infer<
  typeof StorePasswordResetBodySchema
>;

export type StorePasswordResetBodyPEM =
  RequestErrorMessage<StorePasswordResetBody>;

/* -------------------------------------------------------------------------- */
/*                          Store Password Reset Data                         */
/* -------------------------------------------------------------------------- */

export type StorePasswordResetData = {
  message: string;
};

/* -------------------------------------------------------------------------- */
/*                         Store Password Reset Error                         */
/* -------------------------------------------------------------------------- */

export type StorePasswordResetError =
  BadRequestError<StorePasswordResetBodyPEM>;
