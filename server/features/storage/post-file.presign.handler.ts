import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { PresignPostFileRequest } from '#shared/features/storage';

import { generateStorageKey } from '#server/core';
import { createS3UploadUrl, getS3PublicUrl } from '#server/utils/s3';
import { PresignPostFileAbility } from '#shared/features/posts/post.ability';
import { PostConfig } from '#shared/features/posts/post.config';

export const presignPostFileEventHandlerFn: EventHandlerFn<
  PresignPostFileRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(PresignPostFileAbility);

  const session = await userSession.require();
  const uniqueName = generateStorageKey(body.fileName, body.contentType);
  const key = `${session.user.id}/${uniqueName}`;

  const uploadUrl = await createS3UploadUrl(
    PostConfig.FILES_BUCKET,
    key,
    body.contentType
  );
  const publicUrl = getS3PublicUrl(PostConfig.FILES_BUCKET, key);

  return { path: key, publicUrl, uploadUrl };
};
