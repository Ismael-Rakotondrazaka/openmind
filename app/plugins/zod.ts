import { format } from 'date-fns';
import { z } from 'zod';

export const ExtraErrorCode = z.util.arrayToEnum(['required']);

export type ErrorCode = ExtraErrorCode | z.ZodIssueCode;

export type ErrorMapConfig = {
  [Code in ErrorCode]?: ErrorMapMessage | ErrorMapMessageBuilder<Code>;
};

export type ErrorMapMessage = string;

export type ErrorMapMessageBuilder<Code extends ErrorCode> = (
  context: ErrorMapMessageBuilderContext<Code>
) => ErrorMapMessage;

export type ErrorMapMessageBuilderContext<Code extends ErrorCode> =
  Issue<Code> & z.ErrorMapCtx;

type ExtraErrorCode = keyof typeof ExtraErrorCode;

type Issue<Code extends ErrorCode> = Code extends RequiredIssue['code']
  ? RequiredIssue
  : Code extends z.ZodIssueCode
    ? { code: Code } & z.ZodIssueOptionalMessage
    : never;

type RequiredIssue = {
  code: typeof ExtraErrorCode.required;
  expected: z.ZodParsedType;
  received: 'undefined';
} & z.ZodIssueBase;
// type ErrorMapConfigRecord = Record<ErrorCode, ErrorMapMessage | ErrorMapMessageBuilder>
// export type ErrorMapConfig = Partial<ErrorMapConfigRecord>

/**
 * Simplifies the process of making a `ZodErrorMap`
 *
 * ### Usage:
 * ```
 * import { zu } from 'zod_utilz'
 * const errorMap = zu.makeErrorMap( {
 *     required: 'Custom required message',
 *     invalid_type: ( { data } ) => `${ data } is an invalid type`,
 *     too_big: ( { maximum } ) => `Maximum length is ${ maximum }`,
 *     invalid_enum_value: ( { data, options } ) =>
 *         `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
 * } )
 *
 * const stringSchema = z.string( { errorMap } ).max( 32 )
 *
 * zu.SPR( stringSchema.safeParse( undefined ) ).error?.issues[ 0 ].message
 * // Custom required message
 *
 * zu.SPR( stringSchema.safeParse( 42 ) ).error?.issues[ 0 ].message
 * // 42 is an invalid type
 *
 * zu.SPR( stringSchema.safeParse(
 *     'this string is over the maximum length'
 * ) ).error?.issues[ 0 ].message
 * // Maximum length is 32
 *
 * const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )
 *
 * zu.SPR( enumSchema.safeParse( 'baz' ) ).error?.issues[ 0 ].message
 * // baz is not a valid enum value. Valid options: foo | bar
 * ```
 */
function makeErrorMap(config: ErrorMapConfig): z.ZodErrorMap {
  return (issue, ctx) => {
    const errorCode: ErrorCode =
      issue.code === 'invalid_type' && ctx.data === undefined
        ? 'required'
        : issue.code;

    const messageOrBuilder = config[errorCode];
    const context = { ...ctx, ...issue, code: errorCode };

    const message =
      typeof messageOrBuilder === 'function'
        ? // TODO figure out how to deal with:
          // Expression produces a union type that is too complex to represent.
          // @ts-expect-error - Expression produces a union type that is too complex to represent.
          messageOrBuilder(context)
        : messageOrBuilder;

    return message ? { message } : { message: ctx.defaultError };
  };
}

export default defineNuxtPlugin(() => {
  z.setErrorMap(
    makeErrorMap({
      required: context =>
        `This field is required, expect a ${context.expected}, received a ${context.received}`,
      too_big: ctx => {
        const map: Record<
          z.ZodTooBigIssue['type'],
          Record<'exact' | 'inclusive' | 'not_inclusive', string>
        > = {
          array: {
            exact: `Must contain exactly {{maximum}} element(s), given ${(ctx.data as unknown[]).length} element(s)`,
            inclusive: `Must contain at most {{maximum}} element(s), given ${(ctx.data as unknown[]).length} element(s)`,
            not_inclusive: `Must contain less than {{maximum}} element(s), given ${(ctx.data as unknown[]).length} element(s)`,
          },
          bigint: {
            exact: `Must be exactly {{maximum}}, given ${(ctx.data as bigint).toString()}`,
            inclusive: `Must be less than or equal to {{maximum}}, given ${(ctx.data as bigint).toString()}`,
            not_inclusive: `Must be less than {{maximum}}, given ${(ctx.data as bigint).toString()}`,
          },
          date: {
            exact: 'Must be exactly {{- maximum, datetime}}',
            inclusive: 'Must be before or equal to {{- maximum, datetime}}',
            not_inclusive: 'Must be before {{- maximum, datetime}}',
          },
          number: {
            exact: `Must be exactly {{maximum}}, given ${ctx.data}`,
            inclusive: `Must be less than or equal to {{maximum}}, given ${ctx.data}`,
            not_inclusive: `Must be less than {{maximum}}, given ${ctx.data}`,
          },
          set: {
            exact: 'Invalid input',
            inclusive: 'Invalid input',
            not_inclusive: 'Invalid input',
          },
          string: {
            exact: `Must contain exactly {{maximum}} character(s), given ${(ctx.data as string).length} character(s)`,
            inclusive: `Must contain at most {{maximum}} character(s), given ${(ctx.data as string).length} character(s)`,
            not_inclusive: `Must contain under {{maximum}} character(s), given ${(ctx.data as string).length} character(s)`,
          },
        };

        let raw: string = '';
        if (ctx.exact == true) {
          raw = map[ctx.type].exact;
        } else if (ctx.inclusive) {
          raw = map[ctx.type].inclusive;
        } else {
          raw = map[ctx.type].not_inclusive;
        }

        if (ctx.type == 'date') {
          const formatted = format(
            new Date(ctx.maximum as number),
            'MMMM d, y'
          );
          raw = raw.replaceAll('{{- maximum, datetime}}', formatted);
        } else {
          raw = raw.replaceAll('{{maximum}}', `${ctx.maximum}`);
        }

        return raw;
      },
      too_small: ctx => {
        if (ctx.message !== undefined) {
          return ctx.message;
        } else {
          const map: Record<
            z.ZodTooSmallIssue['type'],
            Record<'exact' | 'inclusive' | 'not_inclusive', string>
          > = {
            array: {
              exact: `Must contain exactly {{minimum}} element(s), given ${ctx.data.length} element(s)`,
              inclusive: `Must contain at least {{minimum}} element(s), given ${ctx.data.length} element(s)`,
              not_inclusive: `Must contain more than {{minimum}} element(s), given ${ctx.data.length} element(s)`,
            },
            bigint: {
              exact: `Must be exactly {{minimum}}, given ${(ctx.data as bigint).toString()}`,
              inclusive: `Must be greater than or equal to {{minimum}}, given ${(ctx.data as bigint).toString()}`,
              not_inclusive: `Must be greater than {{minimum}}, given ${(ctx.data as bigint).toString()}`,
            },
            date: {
              exact: 'Must be exactly {{- minimum, datetime}}',
              inclusive: 'Must be after or equal to {{- minimum, datetime}}',
              not_inclusive: 'Must be after {{- minimum, datetime}}',
            },
            number: {
              exact: `Must be exactly {{minimum}}, given ${ctx.data}`,
              inclusive: `Must be greater than or equal to {{minimum}}, given ${ctx.data}`,
              not_inclusive: `Must be greater than {{minimum}}, given ${ctx.data}`,
            },
            set: {
              exact: 'Invalid input',
              inclusive: 'Invalid input',
              not_inclusive: 'Invalid input',
            },
            string: {
              exact: `Must contain exactly {{minimum}} character(s), given ${ctx.data.length} character(s)`,
              inclusive: `Must contain at least {{minimum}} character(s), given ${ctx.data.length} character(s)`,
              not_inclusive: `Must contain over {{minimum}} character(s), given ${ctx.data.length} character(s)`,
            },
          };

          let raw: string = '';
          if (ctx.exact == true) {
            raw = map[ctx.type].exact;
          } else if (ctx.inclusive) {
            raw = map[ctx.type].inclusive;
          } else {
            raw = map[ctx.type].not_inclusive;
          }

          if (ctx.type == 'date') {
            const formatted = format(
              new Date(ctx.minimum as number),
              'MMMM d, y'
            );
            raw = raw.replaceAll('{{- minimum, datetime}}', formatted);
          } else {
            raw = raw.replaceAll('{{minimum}}', `${ctx.minimum}`);
          }

          return raw;
        }
      },
    })
  );
});
