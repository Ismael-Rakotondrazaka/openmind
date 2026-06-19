import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { DeleteUserTagRequest } from '#shared/features/user-tags';

import { DeleteUserTagAbility } from '#shared/features/user-tags';

import { deleteUserTag } from './user-tag.repository';

export const deleteUserTagEventHandlerFn: EventHandlerFn<
  DeleteUserTagRequest
> = async ({ ability, params, userSession }) => {
  await ability.authorize(DeleteUserTagAbility);

  const session = await userSession.require();
  if (params.userId !== session.user.id) {
    throw Exception.forbidden({ data: {} });
  }

  await deleteUserTag(params.userId, params.tagId);
  return { success: true as const };
};
