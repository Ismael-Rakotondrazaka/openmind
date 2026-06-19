import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { GetSignedUrlRequest } from '#shared/features/storage';

import { createS3DownloadUrl } from '#server/utils/s3';

export const getSignedUrlEventHandlerFn: EventHandlerFn<
  GetSignedUrlRequest
> = async ({ query, userSession }) => {
  await userSession.require();

  if (query.path.startsWith('https://') || query.path.startsWith('http://')) {
    return { url: query.path };
  }

  const url = await createS3DownloadUrl(query.bucket, query.path);

  return { url };
};
