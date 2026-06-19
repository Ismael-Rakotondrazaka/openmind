import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { UsernameExistsRequest } from '#shared/features/users';

import { UsernameExistsAbility } from '#shared/features/users/user.ability';

export const usernameExistsEventHandlerFn: EventHandlerFn<
  UsernameExistsRequest
> = async ({ ability, query }) => {
  await ability.authorize(UsernameExistsAbility);

  const exists = await checkUsernameExists(query.username);
  return { exists };
};
