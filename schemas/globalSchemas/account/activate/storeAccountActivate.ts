import { z } from "zod";
import { authConfig } from "~/configs";

/* -------------------------------------------------------------------------- */
/*                         Store account activate body                        */
/* -------------------------------------------------------------------------- */

export const StoreAccountActivateBodySchema = z.object({
  t: z.string().length(authConfig.TOKEN_SIZE),
});

export type StoreAccountActivateBody = z.infer<
  typeof StoreAccountActivateBodySchema
>;

export type StoreAccountActivateBodyPEM =
  RequestErrorMessage<StoreAccountActivateBody>;

/* -------------------------------------------------------------------------- */
/*                         Store account activate data                        */
/* -------------------------------------------------------------------------- */

export type StoreAccountActivateData = {
  message: string;
};

/* -------------------------------------------------------------------------- */
/*                        Store account activate error                        */
/* -------------------------------------------------------------------------- */

export type StoreAccountActivateError =
  BadRequestError<StoreAccountActivateBodyPEM>;
