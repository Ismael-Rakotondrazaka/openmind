import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { destroyUserEventHandlerFn } from '#server/features/users/user.destroy.handler';
import {
  type DestroyUserRequest,
  UserParamsSchema,
} from '#shared/features/users';

export default defineEventHandler(
  new EventHandlerBuilder<DestroyUserRequest>()
    .params(UserParamsSchema)
    .handle(destroyUserEventHandlerFn)
);
