import { constantCase } from 'change-case';
import { getReasonPhrase, ReasonPhrases, StatusCodes } from 'http-status-codes';

import type { ApiError, ApiResponse, ApiResponseMeta } from './api.ts';

import { corsHeaders } from '../cors.ts';

const createResponse = (
  body: string,
  status: StatusCodes,
  headers?: Record<string, string>
) =>
  new Response(body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      ...headers,
    },
    status,
    statusText: getReasonPhrase(status),
  });

const createErrorResponse = (
  code: string,
  message?: string,
  details?: Record<string, unknown>,
  status: StatusCodes = StatusCodes.BAD_REQUEST
): Response => {
  const error: ApiError = {
    code,
    details: details || {},
    message: message || getReasonPhrase(code),
  };

  const response: ApiResponse = {
    data: null,
    error,
    meta: {
      pagination: null,
      timestamp: new Date().toISOString(),
    },
    success: false,
  };

  return createResponse(JSON.stringify(response), status);
};

const createSuccessResponse = <T>(
  data: T,
  status: number = StatusCodes.OK,
  meta?: Partial<ApiResponseMeta>
): Response => {
  const response: ApiResponse<T> = {
    data,
    error: null,
    meta: {
      pagination: null,
      timestamp: new Date().toISOString(),
      ...meta,
    },
    success: true,
  };

  return createResponse(JSON.stringify(response), status);
};

export const apiResponse = Object.freeze({
  accepted: <T>(data: T, meta?: Partial<ApiResponseMeta>) =>
    createSuccessResponse(data, StatusCodes.ACCEPTED, meta),

  badGateway: (message: string = 'Erreur de passerelle (Bad Gateway)') =>
    createErrorResponse(
      constantCase(ReasonPhrases.BAD_GATEWAY),
      message,
      undefined,
      StatusCodes.BAD_GATEWAY
    ),

  // Error responses
  badRequest: (
    code: string,
    message?: string,
    details?: Record<string, unknown>
  ) => createErrorResponse(code, message, details, StatusCodes.BAD_REQUEST),

  conflict: (
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) => createErrorResponse(code, message, details, StatusCodes.CONFLICT),

  created: <T>(data: T, meta?: Partial<ApiResponseMeta>) =>
    createSuccessResponse(data, 201, meta),

  // Custom error response
  customError: (
    code: string,
    message: string,
    status: number = StatusCodes.BAD_REQUEST,
    details?: Record<string, unknown>
  ) => {
    const error: ApiError = {
      code,
      details: details || null,
      message,
    };

    const response: ApiResponse = {
      data: null,
      error,
      meta: {
        pagination: null,
        timestamp: new Date().toISOString(),
      },
      success: false,
    };

    return createResponse(JSON.stringify(response), status);
  },

  forbidden: (message: string = 'Accès refusé') =>
    createErrorResponse(
      constantCase(ReasonPhrases.FORBIDDEN),
      message,
      undefined,
      StatusCodes.FORBIDDEN
    ),

  gatewayTimeout: (message: string = "Temps d'expiration de la passerelle") =>
    createErrorResponse(
      constantCase(ReasonPhrases.GATEWAY_TIMEOUT),
      message,
      undefined,
      StatusCodes.GATEWAY_TIMEOUT
    ),

  gone: (message: string = 'Ressource non trouvée') =>
    createErrorResponse(
      constantCase(ReasonPhrases.GONE),
      message,
      undefined,
      StatusCodes.GONE
    ),

  internalServerError: (
    message: string = 'Erreur interne du serveur',
    details?: Record<string, unknown>
  ) =>
    createErrorResponse(
      constantCase(ReasonPhrases.INTERNAL_SERVER_ERROR),
      message,
      details,
      StatusCodes.INTERNAL_SERVER_ERROR
    ),

  methodNotAllowed: (message: string = 'Méthode non autorisée') =>
    createErrorResponse(
      constantCase(ReasonPhrases.METHOD_NOT_ALLOWED),
      message,
      undefined,
      StatusCodes.METHOD_NOT_ALLOWED
    ),

  noContent: () => createResponse('', StatusCodes.NO_CONTENT),

  notFound: (message: string = 'Ressource non trouvée') =>
    createErrorResponse(
      constantCase(ReasonPhrases.NOT_FOUND),
      message,
      undefined,
      StatusCodes.NOT_FOUND
    ),

  notImplemented: (message: string = 'Méthode non implémentée') =>
    createErrorResponse(
      constantCase(ReasonPhrases.NOT_IMPLEMENTED),
      message,
      undefined,
      StatusCodes.NOT_IMPLEMENTED
    ),

  // Success responses
  ok: <T>(data: T, meta?: Partial<ApiResponseMeta>) =>
    createSuccessResponse(data, 200, meta),

  // Special responses
  options: () => createResponse('', 200),

  serviceUnavailable: (message: string = 'Service indisponible') =>
    createErrorResponse(
      constantCase(ReasonPhrases.SERVICE_UNAVAILABLE),
      message,
      undefined,
      StatusCodes.SERVICE_UNAVAILABLE
    ),

  tooManyRequests: (message: string = 'Trop de requêtes') =>
    createErrorResponse(
      constantCase(ReasonPhrases.TOO_MANY_REQUESTS),
      message,
      undefined,
      StatusCodes.TOO_MANY_REQUESTS
    ),

  unauthorized: (message: string = 'Non autorisé') =>
    createErrorResponse(
      constantCase(ReasonPhrases.UNAUTHORIZED),
      message,
      undefined,
      StatusCodes.UNAUTHORIZED
    ),

  unprocessableEntity: (
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) =>
    createErrorResponse(
      code,
      message,
      details,
      StatusCodes.UNPROCESSABLE_ENTITY
    ),

  validationError: (
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) => createErrorResponse(code, message, details, StatusCodes.BAD_REQUEST),
});
