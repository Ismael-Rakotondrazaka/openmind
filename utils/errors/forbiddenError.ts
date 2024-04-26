import { StatusCodes, getReasonPhrase } from "http-status-codes";
import type { H3Event } from "h3";
import { errorConfig } from "~/configs/errorConfig";

export type ForbiddenError = {
  errorMessage: unknown;
  message: string;
  statusCode: StatusCodes.FORBIDDEN;
  statusMessage: string;
};

export const isForbiddenError = (error: unknown): error is ForbiddenError =>
  typeof error === "object" &&
  error !== null &&
  "errorMessage" in error &&
  typeof error.errorMessage !== "undefined" &&
  "message" in error &&
  typeof error.message === "string" &&
  "statusCode" in error &&
  error.statusCode === StatusCodes.FORBIDDEN &&
  "statusMessage" in error &&
  typeof error.statusMessage === "string";

export const createForbiddenError = (
  event: H3Event,
  args: {
    message?: string;
    isPrivate?: boolean;
    errorMessage?: unknown;
  } = {
    message: errorConfig.DEFAULT_FORBIDDEN_ERROR_MESSAGE,
    isPrivate: false,
    errorMessage: {},
  },
): ForbiddenError => {
  setResponseStatus(event, StatusCodes.FORBIDDEN);

  return {
    errorMessage: args.errorMessage,
    message:
      args.isPrivate || !args.message
        ? errorConfig.DEFAULT_FORBIDDEN_ERROR_MESSAGE
        : args.message,
    statusCode: StatusCodes.FORBIDDEN,
    statusMessage: getReasonPhrase(StatusCodes.FORBIDDEN),
  };
};
