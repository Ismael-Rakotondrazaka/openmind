import { StatusCodes, getReasonPhrase } from "http-status-codes";
import type { H3Event } from "h3";
import { errorConfig } from "~/configs/errorConfig";

export type NotFoundError = {
  errorMessage: unknown;
  message: string;
  statusCode: StatusCodes.NOT_FOUND;
  statusMessage: string;
};

export const isNotFoundError = (error: unknown): error is NotFoundError =>
  typeof error === "object" &&
  error !== null &&
  "errorMessage" in error &&
  typeof error.errorMessage !== "undefined" &&
  "message" in error &&
  typeof error.message === "string" &&
  "statusCode" in error &&
  error.statusCode === StatusCodes.NOT_FOUND &&
  "statusMessage" in error &&
  typeof error.statusMessage === "string";

export const createNotFoundError = (
  event: H3Event,
  args: {
    message?: string;
    isPrivate?: boolean;
    errorMessage?: unknown;
  } = {
    message: errorConfig.DEFAULT_NOT_FOUND_ERROR_MESSAGE,
    isPrivate: false,
    errorMessage: {},
  },
): NotFoundError => {
  setResponseStatus(event, StatusCodes.NOT_FOUND);

  return {
    errorMessage: args.errorMessage,
    message:
      args.isPrivate || !args.message
        ? errorConfig.DEFAULT_NOT_FOUND_ERROR_MESSAGE
        : args.message,
    statusCode: StatusCodes.NOT_FOUND,
    statusMessage: getReasonPhrase(StatusCodes.NOT_FOUND),
  };
};
