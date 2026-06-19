import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { showUserEventHandlerFn } from '#server/features/users/user.show.handler';
import { type ShowUserRequest, UserParamsSchema } from '#shared/features/users';

export default defineEventHandler(
  new EventHandlerBuilder<ShowUserRequest>()
    .params(UserParamsSchema)
    .handle(showUserEventHandlerFn)
);
