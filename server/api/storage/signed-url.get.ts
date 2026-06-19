import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { getSignedUrlEventHandlerFn } from '#server/features/storage/signed-url.handler';
import {
  type GetSignedUrlRequest,
  SignedUrlQuerySchema,
} from '#shared/features/storage';

export default defineEventHandler(
  new EventHandlerBuilder<GetSignedUrlRequest>()
    .query(SignedUrlQuerySchema)
    .handle(getSignedUrlEventHandlerFn)
);
