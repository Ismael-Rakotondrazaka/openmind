import { StatusCodes, getReasonPhrase } from "http-status-codes";
import type { H3Event } from "h3";
import { errorConfig } from "~/utils/configs/errorConfig";

export type BadRequestError<T> = {
  errorMessage: T;
  message: string;
  statusCode: StatusCodes.BAD_REQUEST;
  statusMessage: string;
};

export const isBadRequestError = <T>(
  error: unknown,
): error is BadRequestError<T> => {
  return (
    typeof error === "object" &&
    error !== null &&
    "errorMessage" in error &&
    typeof (error as any).errorMessage !== "undefined" &&
    "message" in error &&
    typeof (error as any).message === "string" &&
    "statusCode" in error &&
    (error as any).statusCode === StatusCodes.BAD_REQUEST &&
    "statusMessage" in error &&
    typeof (error as any).statusMessage === "string"
  );
};

export const createBadRequestError = <T>(
  event: H3Event,
  args: {
    message?: string;
    isPrivate?: boolean;
    errorMessage: T;
  } = {
    message: errorConfig.DEFAULT_BAD_REQUEST_ERROR_MESSAGE,
    isPrivate: false,
    errorMessage: null as T,
  },
): BadRequestError<T> => {
  setResponseStatus(event, StatusCodes.BAD_REQUEST);

  return {
    errorMessage: args.errorMessage,
    message:
      args.isPrivate || !args.message
        ? errorConfig.DEFAULT_BAD_REQUEST_ERROR_MESSAGE
        : args.message,
    statusCode: StatusCodes.BAD_REQUEST,
    statusMessage: getReasonPhrase(StatusCodes.BAD_REQUEST),
  };
};
