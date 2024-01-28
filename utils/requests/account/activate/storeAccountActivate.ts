import { z } from "zod";
import { authConfig } from "~/configs";

export const StoreAccountActivateBodySchema = z.object({
  t: z.string().length(authConfig.TOKEN_SIZE),
});

export type StoreAccountActivateBody = z.infer<
  typeof StoreAccountActivateBodySchema
>;

export type StoreAccountActivateBodyPEM =
  RequestErrorMessage<StoreAccountActivateBody>;

export type StoreAccountActivateData = {
  message: string;
};

export type StoreAccountActivateError =
  BadRequestError<StoreAccountActivateBodyPEM>;
