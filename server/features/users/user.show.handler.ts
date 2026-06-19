import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { ShowUserRequest } from '#shared/features/users';

import { ShowUserAbility } from '#shared/features/users/user.ability';

export const showUserEventHandlerFn: EventHandlerFn<ShowUserRequest> = async ({
  ability,
  params,
}) => {
  await ability.authorize(ShowUserAbility);

  const user = await getUser(params.userId);

  if (user === null) {
    throw Exception.notFound({ data: {} });
  }

  return { data: user };
};
