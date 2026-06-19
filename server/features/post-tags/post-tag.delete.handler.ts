import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { DeletePostTagRequest } from '#shared/features/post-tags';

import { DeletePostTagAbility } from '#shared/features/post-tags';

import { deletePostTag } from './post-tag.repository';

export const deletePostTagEventHandlerFn: EventHandlerFn<
  DeletePostTagRequest
> = async ({ ability, params }) => {
  await ability.authorize(DeletePostTagAbility);
  await deletePostTag(params.postId, params.tagId);
  return { success: true as const };
};
