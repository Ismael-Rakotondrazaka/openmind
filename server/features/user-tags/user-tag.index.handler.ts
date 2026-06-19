import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexUserTagsRequest } from '#shared/features/user-tags';

import { IndexUserTagsAbility } from '#shared/features/user-tags';

import { indexUserTags } from './user-tag.repository';

export const indexUserTagsEventHandlerFn: EventHandlerFn<
  IndexUserTagsRequest
> = async ({ ability, query }) => {
  await ability.authorize(IndexUserTagsAbility);
  return indexUserTags(query);
};
