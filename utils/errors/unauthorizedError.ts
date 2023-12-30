import { StatusCodes, getReasonPhrase } from "http-status-codes";
import type { H3Event } from "h3";
import { errorConfig } from "~/utils/configs/errorConfig";

export type UnauthorizedError = {
  errorMessage: unknown;
  message: string;
  statusCode: StatusCodes.UNAUTHORIZED;
  statusMessage: string;
};

export const isUnauthorizedError = (
  error: unknown,
): error is UnauthorizedError =>
  typeof error === "object" &&
  error !== null &&
  "errorMessage" in error &&
  typeof (error as any).errorMessage !== "undefined" &&
  "message" in error &&
  typeof (error as any).message === "string" &&
  "statusCode" in error &&
  (error as any).statusCode === StatusCodes.UNAUTHORIZED &&
  "statusMessage" in error &&
  typeof (error as any).statusMessage === "string";

export const createUnauthorizedError = (
  event: H3Event,
  args: {
    message?: string;
    isPrivate?: boolean;
    errorMessage?: unknown;
  } = {
    message: errorConfig.DEFAULT_UNAUTHORIZED_ERROR_MESSAGE,
    isPrivate: false,
    errorMessage: {},
  },
): UnauthorizedError => {
  setResponseStatus(event, StatusCodes.UNAUTHORIZED);

  return {
    errorMessage: args.errorMessage,
    message:
      args.isPrivate || !args.message
        ? errorConfig.DEFAULT_UNAUTHORIZED_ERROR_MESSAGE
        : args.message,
    statusCode: StatusCodes.UNAUTHORIZED,
    statusMessage: getReasonPhrase(StatusCodes.UNAUTHORIZED),
  };
};
