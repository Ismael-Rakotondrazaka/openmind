import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { deleteUserTagEventHandlerFn } from '#server/features/user-tags';
import {
  type DeleteUserTagRequest,
  UserTagParamsSchema,
} from '#shared/features/user-tags';

export default defineEventHandler(
  new EventHandlerBuilder<DeleteUserTagRequest>()
    .params(UserTagParamsSchema)
    .handle(deleteUserTagEventHandlerFn)
);
