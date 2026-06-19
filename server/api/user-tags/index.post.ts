import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { createUserTagEventHandlerFn } from '#server/features/user-tags';
import {
  CreateUserTagBodySchema,
  type CreateUserTagRequest,
} from '#shared/features/user-tags';

export default defineEventHandler(
  new EventHandlerBuilder<CreateUserTagRequest>()
    .body(CreateUserTagBodySchema)
    .handle(createUserTagEventHandlerFn)
);
