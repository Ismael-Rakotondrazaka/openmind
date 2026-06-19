import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { UpdateProfileRequest } from '#shared/features/users';

import { UpdateProfileAbility } from '#shared/features/users/user.ability';

export const updateProfileEventHandlerFn: EventHandlerFn<
  UpdateProfileRequest
> = async ({ ability, body, params }) => {
  const user = await getUser(params.userId);

  if (user === null) {
    throw Exception.notFound({ data: {} });
  }

  await ability.authorize(UpdateProfileAbility, user);

  const updated = await updateUser(params.userId, body);

  return { data: updated };
};
