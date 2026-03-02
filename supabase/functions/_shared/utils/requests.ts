import type { HonoRequest } from '@hono/hono/request';
import type { ZodIssue, ZodSchema } from 'zod';

import { apiResponse } from '../utils/responses.ts';

const parseJsonBody = async (
  req: HonoRequest
): Promise<
  | {
      data: unknown;
      success: true;
    }
  | {
      response: Response;
      success: false;
    }
> => {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return {
      response: apiResponse.badRequest(
        'INVALID_JSON',
        'Request body must contain valid JSON'
      ),
      success: false,
    };
  }

  if (body == null) {
    return {
      response: apiResponse.badRequest(
        'MISSING_REQUEST_BODY',
        'Request body is required'
      ),
      success: false,
    };
  }
  if (typeof body === 'object' && Object.keys(body).length === 0) {
    return {
      response: apiResponse.badRequest(
        'EMPTY_REQUEST_BODY',
        'Request body cannot be empty'
      ),
      success: false,
    };
  }

  return {
    data: body,
    success: true,
  };
};

export const validateRequestBody = async <T>(
  schema: ZodSchema<T>,
  request: HonoRequest
): Promise<
  | {
      data: T;
      success: true;
    }
  | {
      response: Response;
      success: false;
    }
> => {
  const parseRequestBodyResult = await parseJsonBody(request);

  if (!parseRequestBodyResult.success) {
    return {
      response: parseRequestBodyResult.response,
      success: false,
    };
  }

  const parseBodyResult = schema.safeParse(parseRequestBodyResult.data);

  if (!parseBodyResult.success) {
    const errors = parseBodyResult.error.issues.map((err: ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return {
      response: apiResponse.badRequest(
        'VALIDATION_ERROR',
        'Request validation failed',
        errors.reduce(
          (acc, err) => {
            acc[err.field] = err.message;
            return acc;
          },
          {} as Record<string, string>
        )
      ),
      success: false,
    };
  }

  return {
    data: parseBodyResult.data,
    success: true,
  };
};

export const validateRequestQuery = <T>(
  schema: ZodSchema<T>,
  request: HonoRequest
):
  | {
      data: T;
      success: true;
    }
  | {
      response: Response;
      success: false;
    } => {
  const queryParams = request.query();

  const parseResult = schema.safeParse(queryParams);

  if (!parseResult.success) {
    const errors = parseResult.error.issues.map((err: ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return {
      response: apiResponse.badRequest(
        'VALIDATION_ERROR',
        'Invalid query parameters',
        errors.reduce(
          (acc, err) => {
            acc[err.field] = err.message;
            return acc;
          },
          {} as Record<string, string>
        )
      ),
      success: false,
    };
  }

  return {
    data: parseResult.data,
    success: true,
  };
};
