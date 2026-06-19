import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { updateProfileEventHandlerFn } from '#server/features/users/user.update.handler';
import {
  UpdateProfileBodySchema,
  type UpdateProfileRequest,
  UserParamsSchema,
} from '#shared/features/users';

export default defineEventHandler(
  new EventHandlerBuilder<UpdateProfileRequest>()
    .body(UpdateProfileBodySchema)
    .params(UserParamsSchema)
    .handle(updateProfileEventHandlerFn)
);
