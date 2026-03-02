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
 *     required: 'Required',
 *     invalid_type: ( { data } ) => `Invalid type: ${ data }`,
 *     too_big: ( { maximum } ) => `Max ${ maximum } characters`,
 *     invalid_enum_value: ( { data, options } ) =>
 *         `Invalid value. Allowed: ${ options?.join( ' | ' ) }`,
 * } )
 *
 * const stringSchema = z.string( { errorMap } ).max( 32 )
 *
 * zu.SPR( stringSchema.safeParse( undefined ) ).error?.issues[ 0 ].message
 * // Required
 *
 * zu.SPR( stringSchema.safeParse( 42 ) ).error?.issues[ 0 ].message
 * // Invalid type: 42
 *
 * zu.SPR( stringSchema.safeParse(
 *     'this string is too long'
 * ) ).error?.issues[ 0 ].message
 * // Max 32 characters
 *
 * const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )
 *
 * zu.SPR( enumSchema.safeParse( 'baz' ) ).error?.issues[ 0 ].message
 * // Invalid value. Allowed: foo | bar
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
        `Required - expected ${context.expected}, got ${context.received}`,
      too_big: ctx => {
        const map: Record<
          z.ZodTooBigIssue['type'],
          Record<'exact' | 'inclusive' | 'not_inclusive', string>
        > = {
          array: {
            exact: `Must have exactly {{maximum}} item(s) - has ${(ctx.data as unknown[]).length}`,
            inclusive: `Max {{maximum}} item(s) - has ${(ctx.data as unknown[]).length}`,
            not_inclusive: `Must have < {{maximum}} item(s) - has ${(ctx.data as unknown[]).length}`,
          },
          bigint: {
            exact: `Must be exactly {{maximum}} - got ${(ctx.data as bigint).toString()}`,
            inclusive: `Max {{maximum}} - got ${(ctx.data as bigint).toString()}`,
            not_inclusive: `Must be < {{maximum}} - got ${(ctx.data as bigint).toString()}`,
          },
          date: {
            exact: 'Must be exactly {{- maximum, datetime}}',
            inclusive: 'Must be ≤ {{- maximum, datetime}}',
            not_inclusive: 'Must be < {{- maximum, datetime}}',
          },
          number: {
            exact: `Must be exactly {{maximum}} - got ${ctx.data}`,
            inclusive: `Max {{maximum}} - got ${ctx.data}`,
            not_inclusive: `Must be < {{maximum}} - got ${ctx.data}`,
          },
          set: {
            exact: 'Invalid',
            inclusive: 'Invalid',
            not_inclusive: 'Invalid',
          },
          string: {
            exact: `Must be exactly {{maximum}} char(s) - ${(ctx.data as string).length} given`,
            inclusive: `Max {{maximum}} char(s) - ${(ctx.data as string).length} given`,
            not_inclusive: `Must be < {{maximum}} char(s) - ${(ctx.data as string).length} given`,
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
              exact: `Must have exactly {{minimum}} item(s) - has ${ctx.data.length}`,
              inclusive: `Min {{minimum}} item(s) - has ${ctx.data.length}`,
              not_inclusive: `Must have > {{minimum}} item(s) - has ${ctx.data.length}`,
            },
            bigint: {
              exact: `Must be exactly {{minimum}} - got ${(ctx.data as bigint).toString()}`,
              inclusive: `Min {{minimum}} - got ${(ctx.data as bigint).toString()}`,
              not_inclusive: `Must be > {{minimum}} - got ${(ctx.data as bigint).toString()}`,
            },
            date: {
              exact: 'Must be exactly {{- minimum, datetime}}',
              inclusive: 'Must be ≥ {{- minimum, datetime}}',
              not_inclusive: 'Must be > {{- minimum, datetime}}',
            },
            number: {
              exact: `Must be exactly {{minimum}} - got ${ctx.data}`,
              inclusive: `Min {{minimum}} - got ${ctx.data}`,
              not_inclusive: `Must be > {{minimum}} - got ${ctx.data}`,
            },
            set: {
              exact: 'Invalid',
              inclusive: 'Invalid',
              not_inclusive: 'Invalid',
            },
            string: {
              exact: `Must be exactly {{minimum}} char(s) - ${ctx.data.length} given`,
              inclusive: `Min {{minimum}} char(s) - ${ctx.data.length} given`,
              not_inclusive: `Must be > {{minimum}} char(s) - ${ctx.data.length} given`,
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
