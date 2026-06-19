import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexPostTagsRequest } from '#shared/features/post-tags';

import { IndexPostTagsAbility } from '#shared/features/post-tags';

import { indexPostTags } from './post-tag.repository';

export const indexPostTagsEventHandlerFn: EventHandlerFn<
  IndexPostTagsRequest
> = async ({ ability, query }) => {
  await ability.authorize(IndexPostTagsAbility);
  return indexPostTags(query);
};
