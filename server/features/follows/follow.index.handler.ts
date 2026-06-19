import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexFollowsRequest } from '#shared/features/follows';

export const indexFollowsEventHandlerFn: EventHandlerFn<
  IndexFollowsRequest
> = async ({ query }) => {
  return getFollows(query);
};
