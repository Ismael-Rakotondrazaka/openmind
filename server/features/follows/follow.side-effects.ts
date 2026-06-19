import type { FollowModel } from '#shared/features/follows';

import { enqueueNotification } from '#server/features/notifications/notification.repository';

export const onFollowCreated = async (follow: FollowModel): Promise<void> => {
  await enqueueNotification({
    actorId: follow.followerId,
    data: {},
    recipientId: follow.followingId,
    type: 'user_followed',
  });
};
