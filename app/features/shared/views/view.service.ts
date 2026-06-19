import type { RecordViewBody } from '#shared/features/views';
import type { H3Event$Fetch } from 'nitropack/types';

export const recordView = async (
  body: RecordViewBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/views', {
    body,
    method: 'POST',
  });
};
