import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { presignPostFileEventHandlerFn } from '#server/features/storage/post-file.presign.handler';
import {
  PostFileParamsSchema,
  PresignDocumentBodySchema,
  type PresignPostFileRequest,
} from '#shared/features/storage';

export default defineEventHandler(
  new EventHandlerBuilder<PresignPostFileRequest>()
    .params(PostFileParamsSchema)
    .body(PresignDocumentBodySchema)
    .handle(presignPostFileEventHandlerFn)
);
