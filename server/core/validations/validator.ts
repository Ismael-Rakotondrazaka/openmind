import type { z } from 'zod';

import { Exception } from '#server/core/exceptions/exception';
import { zfd } from 'zod-form-data';

import { ValidationErrorFormatter } from './validationErrorFormatter';

export type ValidationSafeResult<T extends z.ZodTypeAny> =
  | {
      data: z.output<T>;
      isSuccess: true;
    }
  | {
      error: ResponseErrorData<z.input<T>>;
      isSuccess: false;
    };

export class Validator {
  public async validate<T extends z.ZodTypeAny>(
    schema: T,
    input: unknown
  ): Promise<z.output<T>> {
    const spr: z.SafeParseReturnType<z.input<T>, z.output<T>> = await zfd
      .formData(schema)
      .safeParseAsync(input);

    if (spr.success) {
      return spr.data;
    }

    throw Exception.badRequest({
      data: ValidationErrorFormatter.format(spr.error),
    });
  }

  public async validateSafe<T extends z.ZodTypeAny>(
    schema: T,
    input: unknown
  ): Promise<ValidationSafeResult<T>> {
    const spr: z.SafeParseReturnType<z.input<T>, z.output<T>> = zfd
      .formData(schema)
      .safeParse(input);

    if (spr.success) {
      return {
        data: spr.data,
        isSuccess: true,
      };
    } else {
      return {
        error: ValidationErrorFormatter.format(spr.error),
        isSuccess: false,
      };
    }
  }
}
