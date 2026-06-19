import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexReactionsEventHandlerFn } from '#server/features/reactions/reaction.index.handler';
import {
  IndexReactionsQuerySchema,
  type IndexReactionsRequest,
} from '#shared/features/reactions';

export default defineEventHandler(
  new EventHandlerBuilder<IndexReactionsRequest>()
    .query(IndexReactionsQuerySchema)
    .handle(indexReactionsEventHandlerFn)
);
