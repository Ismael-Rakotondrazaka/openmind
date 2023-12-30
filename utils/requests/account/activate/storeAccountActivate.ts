import { z } from "zod";
import { authConfig } from "~/utils";

export const storeAccountActivateBodySchema = z.object({
  t: z.string().length(authConfig.TOKEN_SIZE),
});

export type StoreAccountActivateBody = z.infer<
  typeof storeAccountActivateBodySchema
>;

export type StoreAccountActivateBodyPEM =
  RequestErrorMessage<StoreAccountActivateBody>;

export type StoreAccountActivateData = {
  message: string;
};

export type StoreAccountActivateError =
  BadRequestError<StoreAccountActivateBodyPEM>;
