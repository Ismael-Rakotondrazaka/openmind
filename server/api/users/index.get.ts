import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexUsersEventHandlerFn } from '#server/features/users/user.index.handler';
import {
  IndexUsersQuerySchema,
  type IndexUsersRequest,
} from '#shared/features/users';

export default defineEventHandler(
  new EventHandlerBuilder<IndexUsersRequest>()
    .query(IndexUsersQuerySchema)
    .handle(indexUsersEventHandlerFn)
);
