import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { DestroyTagRequest } from '#shared/features/tags';

import { DestroyTagAbility } from '#shared/features/tags/tag.ability';

export const destroyTagEventHandlerFn: EventHandlerFn<
  DestroyTagRequest
> = async ({ ability, params }) => {
  await ability.authorize(DestroyTagAbility);

  const tag = await prisma.tag.findUnique({ where: { id: params.tagId } });

  if (tag === null) {
    throw Exception.notFound({ data: {} });
  }

  await deleteTag(params);

  return { data: tag };
};
