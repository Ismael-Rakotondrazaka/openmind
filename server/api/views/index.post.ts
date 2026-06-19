import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { recordViewEventHandlerFn } from '#server/features/views/view.record.handler';
import {
  RecordViewBodySchema,
  type RecordViewRequest,
} from '#shared/features/views';

export default defineEventHandler(
  new EventHandlerBuilder<RecordViewRequest>()
    .body(RecordViewBodySchema)
    .handle(recordViewEventHandlerFn)
);
