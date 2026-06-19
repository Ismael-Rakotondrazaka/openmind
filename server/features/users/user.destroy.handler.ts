import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { DestroyUserRequest } from '#shared/features/users';

import { DestroyUserAbility } from '#shared/features/users/user.ability';

export const destroyUserEventHandlerFn: EventHandlerFn<
  DestroyUserRequest
> = async ({ ability, params }) => {
  await ability.authorize(DestroyUserAbility);

  const user = await getUser(params.userId);

  if (user === null) {
    throw Exception.notFound({ data: {} });
  }

  await deleteUser(params.userId);

  return { data: user };
};
