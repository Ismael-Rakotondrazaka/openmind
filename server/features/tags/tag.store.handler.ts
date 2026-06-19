import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { StoreTagRequest } from '#shared/features/tags';

import { StoreTagAbility } from '#shared/features/tags/tag.ability';

export const storeTagEventHandlerFn: EventHandlerFn<StoreTagRequest> = async ({
  ability,
  body,
}) => {
  await ability.authorize(StoreTagAbility);

  const tag = await createTag(body);

  return { data: tag };
};
