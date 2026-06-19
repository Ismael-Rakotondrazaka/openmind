import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { presignUserAvatarEventHandlerFn } from '#server/features/storage/user-avatar.presign.handler';
import {
  PresignBodySchema,
  type PresignUserAvatarRequest,
  UserAvatarParamsSchema,
} from '#shared/features/storage';

export default defineEventHandler(
  new EventHandlerBuilder<PresignUserAvatarRequest>()
    .params(UserAvatarParamsSchema)
    .body(PresignBodySchema)
    .handle(presignUserAvatarEventHandlerFn)
);
