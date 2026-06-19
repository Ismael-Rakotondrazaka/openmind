import type { Validator } from '#server/core/validations/validator';
import type { Request } from '#shared/requests/request';
import type { H3Event } from 'h3';
import type { QueryObject } from 'ufo';
import type { z } from 'zod';

export class RequestInputGetter<
  TRequest extends {
    body?: unknown;
    query?: QueryObject;
    routerParams?: Record<string, never | number | string>;
  },
> {
  // @ts-expect-error - In Request.routerParams, type number is not assignable to type string
  #event: H3Event<TRequest>;
  #validator: Validator;

  // @ts-expect-error - In Request.routerParams, type number is not assignable to type string
  constructor(event: H3Event<TRequest>, validator: Validator) {
    this.#event = event;
    this.#validator = validator;
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Body                                    */
  /* -------------------------------------------------------------------------- */

  async getUnsafeBody(): Promise<TRequest['body']> {
    let result: unknown = {};

    const requestContentType: string | undefined = getHeader(
      this.#event,
      'Content-Type'
    );

    if (requestContentType !== undefined) {
      if (requestContentType.startsWith('application/json')) {
        try {
          const JSONBody: unknown = await readBody(this.#event);

          if (JSONBody !== undefined && JSONBody !== null) {
            result = JSONBody;
          }
        } catch {
          return result;
        }
      } else if (
        requestContentType.startsWith('application/x-www-form-urlencoded') ||
        requestContentType.startsWith('multipart/form-data')
      ) {
        result = await readFormData(this.#event);
      }
    }

    return result;
  }

  getUnsafeParams() {
    return getRouterParams(this.#event);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Params                                   */
  /* -------------------------------------------------------------------------- */

  getUnsafeQueries() {
    return getQuery(this.#event);
  }

  async getValidatedBody<
    TSchema extends z.ZodType<TRequest['body'], z.ZodTypeDef, unknown>,
  >(schema: TSchema): Promise<TRequest['body']> {
    const body = await this.getUnsafeBody();
    return this.#validator.validate(schema, body);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Queries                                  */
  /* -------------------------------------------------------------------------- */

  async getValidatedParams<
    TSchema extends z.ZodType<TRequest['routerParams'], z.ZodTypeDef, unknown>,
  >(schema: TSchema) {
    return this.#validator.validate(schema, this.getUnsafeParams());
  }

  getValidatedQueries<
    TSchema extends z.ZodType<TRequest['query'], z.ZodTypeDef, unknown>,
  >(schema: TSchema) {
    return this.#validator.validate(schema, this.getUnsafeQueries());
  }

  haveWhereQueries<TWhereKey extends keyof TRequest['query']>(
    queries: NonNullable<TRequest['query']>,
    keys: readonly TWhereKey[]
  ) {
    // @ts-expect-error Type 'keyof NonNullable<TRequest["query"]>' cannot be used to index type 'QueryObject'.
    return keys.some(key => key in queries && queries[key] !== undefined);
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class RequestInputHelper {
  static haveWhereQueries<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TRequest extends Request<any, any, any, any>,
    TWhereKey extends keyof TRequest['input']['query'] =
      keyof TRequest['input']['query'],
  >(
    queries: NonNullable<TRequest['input']['query']>,
    keys: readonly TWhereKey[]
  ) {
    return keys.some(key => key in queries && queries[key] !== undefined);
  }
}
