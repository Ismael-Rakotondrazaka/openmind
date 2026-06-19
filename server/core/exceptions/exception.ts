import type { NuxtError } from 'nuxt/app';

import { logger } from '#server/core/loggers/logger';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class Exception<TData> extends Error {
  readonly data: TData;
  override readonly message: string;
  readonly statusCode: StatusCodes;
  readonly statusMessage: ReasonPhrases;
  #nuxtError: NuxtError<TData>;

  constructor(arg: {
    data: TData;
    message: string;
    statusCode: StatusCodes;
    statusMessage: ReasonPhrases;
  }) {
    super(arg.message);
    this.data = arg.data;
    this.message = arg.message;
    this.statusMessage = arg.statusMessage;
    this.statusCode = arg.statusCode;
    this.#nuxtError = createError(this);
  }

  public static badRequest<T>(arg: {
    data: T;
    message?: string;
  }): Exception<T> {
    const { data } = arg;
    const message = arg.message ?? 'errors.requests.defaults.badRequest';

    return new Exception({
      data,
      message,
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: ReasonPhrases.BAD_REQUEST,
    });
  }

  public static forbidden<T>(arg: { data: T; message?: string }): Exception<T> {
    const { data } = arg;
    const message = arg.message ?? 'errors.requests.defaults.forbidden';

    return new Exception({
      data,
      message,
      statusCode: StatusCodes.FORBIDDEN,
      statusMessage: ReasonPhrases.FORBIDDEN,
    });
  }

  public static fromUnknown(arg: {
    error: unknown;
    path: string;
  }): Exception<unknown> {
    const { error, path } = arg;

    if (error instanceof Exception) {
      return error;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      'message' in error &&
      (typeof error.message === 'string' ||
        typeof error.message === 'undefined') &&
      'data' in error
    ) {
      switch (error.statusCode) {
        case StatusCodes.BAD_REQUEST:
          return Exception.badRequest({
            data: error.data,
            message: error.message,
          });
        case StatusCodes.FORBIDDEN:
          return Exception.forbidden({
            data: error.data,
            message: error.message,
          });
        case StatusCodes.INTERNAL_SERVER_ERROR:
          return Exception.internalServer({
            data: error.data,
            message: error.message,
            path,
          });
        case StatusCodes.NOT_FOUND:
          return Exception.notFound({
            data: error.data,
            message: error.message,
          });
        case StatusCodes.NOT_IMPLEMENTED:
          return Exception.notImplemented({
            data: error.data,
            message: error.message,
          });
        case StatusCodes.UNAUTHORIZED:
          return Exception.unauthorized({
            data: error.data,
            message: error.message,
          });
        default:
          return new Exception({
            data: error.data,
            message: error.message ?? 'errors.default',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            statusMessage: ReasonPhrases.INTERNAL_SERVER_ERROR,
          });
      }
    }

    logger.error(error instanceof Error ? error.message : 'errors.default', {
      path,
    });

    return new Exception({
      data: {},
      message: 'errors.default',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }

  public static internalServer<T>(arg: {
    data: T;
    message?: string;
    path: string;
  }): Exception<T> {
    const { data, path } = arg;
    const message = arg.message ?? 'errors.requests.defaults.internalServer';

    logger.error('Internal Server error', { path });

    return new Exception({
      data,
      message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }

  public static notFound<T>(arg: { data: T; message?: string }): Exception<T> {
    const { data } = arg;
    const message = arg.message ?? 'errors.requests.defaults.notFound';

    return new Exception({
      data,
      message,
      statusCode: StatusCodes.NOT_FOUND,
      statusMessage: ReasonPhrases.NOT_FOUND,
    });
  }

  public static notImplemented<T>(arg: {
    data: T;
    message?: string;
  }): Exception<T> {
    const { data } = arg;
    const message = arg.message ?? 'errors.requests.defaults.notImplemented';

    return new Exception({
      data,
      message,
      statusCode: StatusCodes.NOT_IMPLEMENTED,
      statusMessage: ReasonPhrases.NOT_IMPLEMENTED,
    });
  }

  public static unauthorized<T>(arg: {
    data: T;
    message?: string;
  }): Exception<T> {
    const { data } = arg;
    const message = arg.message ?? 'errors.requests.defaults.unauthorized';

    return new Exception({
      data,
      message,
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
    });
  }

  getNuxtError(): NuxtError<TData> {
    return this.#nuxtError;
  }
}
