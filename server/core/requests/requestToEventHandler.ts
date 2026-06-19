import type { UserSession, UserSessionRequired } from '#auth-utils';
import type { Request, RequestToWSMessage } from '#shared/utils/request';
import type { Peer } from 'crossws';
import type { EventHandler } from 'h3';

import type {
  BouncerAbility,
  BouncerArgs,
} from '../../../node_modules/nuxt-authorization/dist/utils/index.mjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type EventHandlerFn<R extends Request<any, any, any, any>> = (inputs: {
  ability: {
    allows: <Ability extends BouncerAbility<any>>(
      ability: Ability,
      ...args: BouncerArgs<Ability>
    ) => Promise<boolean>;
    authorize: <Ability extends BouncerAbility<any>>(
      ability: Ability,
      ...args: BouncerArgs<Ability>
    ) => Promise<void>;
    authorizeAndReturnUserSession: <Ability extends BouncerAbility<any>>(
      ability: Ability,
      ...args: BouncerArgs<Ability>
    ) => Promise<UserSession>;
    denies: <Ability extends BouncerAbility<any>>(
      ability: Ability,
      ...args: BouncerArgs<Ability>
    ) => Promise<boolean>;
  };
  body: R['input']['body'];
  locale: string;
  params: R['input']['params'];
  path: string;
  query: R['input']['query'];
  userSession: {
    get: () => Promise<UserSession>;
    replace: (data: Omit<UserSession, 'id'>) => Promise<UserSession>;
    require: () => Promise<UserSessionRequired>;
  };
}) => R['output'];

export type RequestToEventHandler<R extends Request<any, any, any, any>> =
  EventHandler<
    {
      body: R['input']['body'];
      query: R['input']['query'];
      routerParams: R['input']['params'];
    },
    R['output']
  >;

export type RequestToWSEventHandler<
  TEventName extends string,
  TRequest extends Request<any, any, any, any>,
> = (
  peer: Peer,
  message: RequestToWSMessage<TEventName, TRequest>
) => Promise<TRequest['output']>;

/* eslint-enable @typescript-eslint/no-explicit-any */
