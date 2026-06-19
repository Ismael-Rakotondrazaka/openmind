import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexFollowsEventHandlerFn } from '#server/features/follows';
import {
  IndexFollowsQuerySchema,
  type IndexFollowsRequest,
} from '#shared/features/follows';

export default defineEventHandler(
  new EventHandlerBuilder<IndexFollowsRequest>()
    .query(IndexFollowsQuerySchema)
    .handle(indexFollowsEventHandlerFn)
);
