import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { CreatePostTagRequest } from '#shared/features/post-tags';

import { CreatePostTagAbility } from '#shared/features/post-tags';

import { createPostTag } from './post-tag.repository';

export const createPostTagEventHandlerFn: EventHandlerFn<
  CreatePostTagRequest
> = async ({ ability, body }) => {
  await ability.authorize(CreatePostTagAbility);
  return createPostTag(body.postId, body.tagId);
};
