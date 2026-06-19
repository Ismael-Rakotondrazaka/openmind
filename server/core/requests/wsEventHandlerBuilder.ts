import type {
  EventHandlerFn,
  RequestToWSEventHandler,
} from '#server/core/requests/requestToEventHandler';
import type { Request, RequestToWSMessage } from '#shared/requests/request';
import type { Peer } from 'crossws';

import { Exception } from '#server/core';
import { allows as _allows, denies as _denies } from 'nuxt-authorization/utils';
import { parseURL } from 'ufo';
import { z } from 'zod';

type CallBackFn<TOutput> = (
  output: TOutput,

  peer: Peer
) => Promise<void> | void;

export class WSEventHandlerBuilder<
  TEventName extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRequest extends Request<any, any, any, any>,
> {
  eventName: TEventName;
  private bodySchema?: z.ZodType<TRequest['input']['body']>;
  private callbackFn?: CallBackFn<Awaited<TRequest['output']>>;
  private paramsSchema?: z.ZodType<TRequest['input']['params']>;
  private querySchema?: z.ZodType<TRequest['input']['query']>;

  constructor(eventName: TEventName) {
    this.eventName = eventName;
  }

  body<T extends z.ZodType<TRequest['input']['body'], z.ZodTypeDef, unknown>>(
    schema: T
  ): WSEventHandlerBuilder<TEventName, TRequest> {
    this.bodySchema = schema;
    return this;
  }

  /**
   * Set a callback to be called after the event handler is executed.
   * This is useful for logging or other side effects.
   */
  callback(
    callbackFn: CallBackFn<Awaited<TRequest['output']>>
  ): WSEventHandlerBuilder<TEventName, TRequest> {
    this.callbackFn = callbackFn;
    return this;
  }

  handle(
    handler: EventHandlerFn<TRequest>
  ): RequestToWSEventHandler<TEventName, TRequest> {
    return async (peer, message) => {
      try {
        const userSession = await requireUserSession(peer);

        const validatorSchema = this.#makeMessageValidator();

        const validatedMessage = validatorSchema.parse(message);

        const locale =
          peer.request.headers
            .get('cookie')
            ?.split('; ')
            .find(c => c.startsWith('i18n_locale='))
            ?.split('=')[1] ??
          peer.request.headers
            .get('accept-language')
            ?.split(',')[0]
            ?.split('-')[0] ??
          'fr';

        const output = await handler({
          ability: {
            allows: (ability, ...args) => {
              return _allows(ability, userSession.user, ...args);
            },
            authorize: async (ability, ...args) => {
              if (await _allows(ability, userSession, ...args)) {
                return Promise.resolve();
              }

              throw Exception.forbidden({
                data: {},
              });
            },
            authorizeAndReturnUserSession: async (ability, ...args) => {
              if (await _allows(ability, userSession.user, ...args)) {
                return userSession;
              }

              throw Exception.forbidden({
                data: {},
              });
            },
            denies: (ability, ...args) => {
              return _denies(ability, userSession, ...args);
            },
          },
          body: validatedMessage.body,
          locale,
          params: validatedMessage.params,
          path: this.#getPathFromPeer(peer),
          query: validatedMessage.query,
          userSession: {
            get: () => {
              return getUserSession(peer);
            },
            replace: () => {
              throw Exception.notImplemented({
                data: {},
              });
            },
            require: () => {
              return requireUserSession(peer);
            },
          },
        });

        if (this.callbackFn) {
          this.callbackFn(output, peer);
        }

        return output;
      } catch (error) {
        throw Exception.fromUnknown({
          error,
          path: this.#getPathFromPeer(peer),
        });
      }
    };
  }

  params<
    T extends z.ZodType<TRequest['input']['params'], z.ZodTypeDef, unknown>,
  >(schema: T): WSEventHandlerBuilder<TEventName, TRequest> {
    this.paramsSchema = schema;
    return this;
  }

  query<T extends z.ZodType<TRequest['input']['query'], z.ZodTypeDef, unknown>>(
    schema: T
  ): WSEventHandlerBuilder<TEventName, TRequest> {
    this.querySchema = schema;
    return this;
  }

  #getPathFromPeer(peer: Peer) {
    return parseURL(peer.request.url).pathname;
  }

  #makeMessageValidator(): z.ZodType<RequestToWSMessage<TEventName, TRequest>> {
    return z.object({
      body: this.bodySchema ? this.bodySchema : z.object({}),
      eventName: z.literal(this.eventName),
      params: this.paramsSchema ? this.paramsSchema : z.object({}),
      query: this.querySchema ? this.querySchema : z.object({}),
    }) as z.ZodType<RequestToWSMessage<TEventName, TRequest>>;
  }
}
