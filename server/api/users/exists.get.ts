import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { usernameExistsEventHandlerFn } from '#server/features/users/user.exists.handler';
import {
  UsernameExistsQuerySchema,
  type UsernameExistsRequest,
} from '#shared/features/users';

export default defineEventHandler(
  new EventHandlerBuilder<UsernameExistsRequest>()
    .query(UsernameExistsQuerySchema)
    .handle(usernameExistsEventHandlerFn)
);
