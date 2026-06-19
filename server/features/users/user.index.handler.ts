import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexUsersRequest } from '#shared/features/users';

import { IndexUsersAbility } from '#shared/features/users/user.ability';

export const indexUsersEventHandlerFn: EventHandlerFn<
  IndexUsersRequest
> = async ({ ability, query }) => {
  await ability.authorize(IndexUsersAbility);

  return getUsers(query);
};
