import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexTagsRequest } from '#shared/features/tags';

import { IndexTagsAbility } from '#shared/features/tags/tag.ability';

export const indexTagsEventHandlerFn: EventHandlerFn<
  IndexTagsRequest
> = async ({ ability, query }) => {
  await ability.authorize(IndexTagsAbility);

  return getTags(query);
};
