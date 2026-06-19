import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { CreateUserTagRequest } from '#shared/features/user-tags';

import { CreateUserTagAbility } from '#shared/features/user-tags';

import { createUserTag } from './user-tag.repository';

export const createUserTagEventHandlerFn: EventHandlerFn<
  CreateUserTagRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(CreateUserTagAbility);

  const session = await userSession.require();
  if (body.userId !== session.user.id) {
    throw Exception.forbidden({ data: {} });
  }

  return createUserTag(body.userId, body.tagId);
};
