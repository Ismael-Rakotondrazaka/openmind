import type { ResponseErrorIssue } from '#shared/utils/response';
import type { ZodIssueOptionalMessage } from 'zod';

import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class ValidationErrorFormatter {
  public static format<T extends z.ZodTypeAny>(
    error: z.ZodError<T>
  ): ResponseErrorData<T> {
    const result: ResponseErrorData<T> = {};

    error.issues.forEach(issue => {
      result[issue.path.join('.') as keyof ResponseErrorData<T>] =
        this.#formatIssue(issue);
    });

    return result;
  }

  static #formatIssue(issue: ZodIssueOptionalMessage): ResponseErrorIssue {
    const d = (
      dateInput: Date | number | string,
      format: Intl.DateTimeFormatOptions,
      locale: string = 'en-US'
    ): string => {
      const fallbackValue = 'Invalid Date';

      try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return fallbackValue;

        const formatter = new Intl.DateTimeFormat(locale, format);
        const formatted = formatter.format(date);

        return typeof formatted === 'string' ? formatted : fallbackValue;
      } catch {
        return fallbackValue;
      }
    };

    switch (issue.code) {
      case z.ZodIssueCode.custom:
        return ['zodI18n.errors.custom', {}];

      case z.ZodIssueCode.invalid_arguments:
        return ['zodI18n.errors.invalid_arguments', {}];

      case z.ZodIssueCode.invalid_date:
        return ['zodI18n.errors.invalid_date', {}];

      case z.ZodIssueCode.invalid_enum_value:
        return [
          'zodI18n.errors.invalid_enum_value',
          {
            options: this.#joinValues(issue.options),
            received: issue.received,
          },
        ];

      case z.ZodIssueCode.invalid_intersection_types:
        return ['zodI18n.errors.invalid_intersection_types', {}];

      case z.ZodIssueCode.invalid_literal:
        return [
          'zodI18n.errors.invalid_literal',
          {
            expected: JSON.stringify(
              issue.expected,
              this.#jsonStringifyReplacer
            ),
          },
        ];

      case z.ZodIssueCode.invalid_return_type:
        return ['zodI18n.errors.invalid_return_type', {}];

      case z.ZodIssueCode.invalid_string:
        if (typeof issue.validation === 'object') {
          if ('startsWith' in issue.validation) {
            return [
              'zodI18n.errors.invalid_string.startsWith',
              { startsWith: issue.validation.startsWith },
            ];
          } else if ('endsWith' in issue.validation) {
            return [
              'zodI18n.errors.invalid_string.endsWith',
              { endsWith: issue.validation.endsWith },
            ];
          }
        } else {
          return [
            `zodI18n.errors.invalid_string.${issue.validation}`,
            {
              // ! if key is validation, need to translate the options
              validation: `zodI18n.validations.${issue.validation}`,
            },
          ];
        }
        break;

      case z.ZodIssueCode.invalid_type:
        if (issue.received === z.ZodParsedType.undefined) {
          return ['zodI18n.errors.invalid_type_received_undefined', {}];
        }
        return [
          'zodI18n.errors.invalid_type',
          {
            // ! if key is expected or received, need to translate the options
            expected: issue.expected,
            received: issue.received,
          },
        ];

      case z.ZodIssueCode.invalid_union:
        return ['zodI18n.errors.invalid_union', {}];

      case z.ZodIssueCode.invalid_union_discriminator:
        return [
          'zodI18n.errors.invalid_union_discriminator',
          {
            options: this.#joinValues(issue.options),
          },
        ];

      case z.ZodIssueCode.not_finite:
        return ['zodI18n.errors.not_finite', {}];

      case z.ZodIssueCode.not_multiple_of:
        return [
          'zodI18n.errors.not_multiple_of',
          {
            multipleOf:
              typeof issue.multipleOf === 'bigint'
                ? issue.multipleOf.toString()
                : issue.multipleOf,
          },
        ];

      case z.ZodIssueCode.too_big: {
        const { dateFormat } = useRuntimeConfig().public.zodI18n;
        const maximum =
          issue.type === 'date'
            ? d(
                new Date(
                  typeof issue.maximum === 'bigint'
                    ? Number(issue.maximum)
                    : issue.maximum
                ),
                dateFormat as Intl.DateTimeFormatOptions
              )
            : issue.maximum;

        return [
          `zodI18n.errors.too_big.${issue.type}.${issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'}`,
          {
            maximum: typeof maximum === 'bigint' ? maximum.toString() : maximum,
          },
        ];
      }

      case z.ZodIssueCode.too_small: {
        const { dateFormat } = useRuntimeConfig().public.zodI18n;
        const minimum =
          issue.type === 'date'
            ? d(
                new Date(
                  typeof issue.minimum === 'bigint'
                    ? Number(issue.minimum)
                    : issue.minimum
                ),
                dateFormat as Intl.DateTimeFormatOptions
              )
            : issue.minimum;

        return [
          `zodI18n.errors.too_small.${issue.type}.${issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'}`,
          {
            minimum: typeof minimum === 'bigint' ? minimum.toString() : minimum,
          },
        ];
      }

      case z.ZodIssueCode.unrecognized_keys:
        return [
          'zodI18n.errors.unrecognized_keys',
          {
            keys: this.#joinValues(issue.keys, ', '),
          },
        ];

      default:
        return ['zodI18n.errors.custom', {}];
    }

    return ['zodI18n.errors.custom', {}];
  }

  static #joinValues(array: unknown[], separator = ' | ') {
    return array
      .map(val => (typeof val === 'string' ? `'${val}'` : val))
      .join(separator);
  }

  static #jsonStringifyReplacer(_: unknown, value: unknown) {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }
}
