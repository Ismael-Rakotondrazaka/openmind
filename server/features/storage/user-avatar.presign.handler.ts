import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { PresignUserAvatarRequest } from '#shared/features/storage';

import { generateStorageKey } from '#server/core';
import { createS3UploadUrl, getS3PublicUrl } from '#server/utils/s3';
import { UpdateProfileAbility } from '#shared/features/users/user.ability';
import { UserConfig } from '#shared/features/users/user.config';

export const presignUserAvatarEventHandlerFn: EventHandlerFn<
  PresignUserAvatarRequest
> = async ({ ability, body, params }) => {
  await ability.authorize(UpdateProfileAbility, { id: params.userId });

  const uniqueName = generateStorageKey(body.fileName, body.contentType);
  const key = `${params.userId}/${uniqueName}`;

  const uploadUrl = await createS3UploadUrl(
    UserConfig.AVATARS_BUCKET,
    key,
    body.contentType
  );
  const publicUrl = getS3PublicUrl(UserConfig.AVATARS_BUCKET, key);

  return { publicUrl, uploadUrl };
};
