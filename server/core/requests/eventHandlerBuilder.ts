import type {
  EventHandlerFn,
  RequestToEventHandler,
} from '#server/core/requests/requestToEventHandler';
import type { Request } from '#shared/utils/request';
import type { z } from 'zod';

import { allows as _allows, denies as _denies } from '#imports';
import { Exception } from '#server/core';

export class EventHandlerBuilder<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRequest extends Request<any, any, any, any>,
> {
  private bodySchema?: TRequest['input']['body'];
  private paramsSchema?: TRequest['input']['params'];
  private querySchema?: TRequest['input']['query'];

  body<T extends z.ZodType<TRequest['input']['body'], z.ZodTypeDef, unknown>>(
    schema: T
  ): EventHandlerBuilder<TRequest> {
    this.bodySchema = schema;
    return this;
  }

  handle(handler: EventHandlerFn<TRequest>): RequestToEventHandler<TRequest> {
    return async event => {
      try {
        const validator = new Validator();
        const input = new RequestInputGetter(event, validator);

        const [query, body, params] = await Promise.all([
          this.querySchema ? input.getValidatedQueries(this.querySchema) : {},
          this.bodySchema ? input.getValidatedBody(this.bodySchema) : {},
          this.paramsSchema ? input.getValidatedParams(this.paramsSchema) : {},
        ]);

        const locale =
          getCookie(event, 'i18n_locale') ??
          getHeader(event, 'accept-language')?.split(',')[0]?.split('-')[0] ??
          'fr';

        return await handler({
          ability: {
            allows: (ability, ...args) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return _allows(event, ability, ...args);
            },
            authorize: async (ability, ...args) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              if (await _allows(event, ability, ...args)) {
                return Promise.resolve();
              }

              throw Exception.forbidden({
                data: {},
              });
            },
            authorizeAndReturnUserSession: async (ability, ...args) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              if (await _allows(event, ability, ...args)) {
                return getUserSession(event);
              }

              throw Exception.forbidden({
                data: {},
              });
            },
            denies: (ability, ...args) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return _denies(event, ability, ...args);
            },
          },
          body,
          locale,
          params,
          path: event.path,
          query,
          userSession: {
            get: () => {
              return getUserSession(event);
            },
            replace: data => {
              return replaceUserSession(event, data);
            },
            require: () => {
              return requireUserSession(event);
            },
          },
        });
      } catch (error) {
        throw Exception.fromUnknown({
          error,
          path: event.path,
        }).getNuxtError();
      }
    };
  }

  params<
    T extends z.ZodType<TRequest['input']['params'], z.ZodTypeDef, unknown>,
  >(schema: T): EventHandlerBuilder<TRequest> {
    this.paramsSchema = schema;
    return this;
  }

  query<T extends z.ZodType<TRequest['input']['query'], z.ZodTypeDef, unknown>>(
    schema: T
  ): EventHandlerBuilder<TRequest> {
    this.querySchema = schema;
    return this;
  }
}
