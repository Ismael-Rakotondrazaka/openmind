import type { InfiniteData } from '@tanstack/vue-query';

import type { PaginationResult } from '~/features/shared/paginations/pagination.model';

import type { Notification } from '../notification.model';

import { NotificationConfig } from '../notification.model';
import { getUserNotifications } from '../notification.service';

export const useGetUserNotifications = (
  userId: MaybeRefOrGetter<string | undefined>
) => {
  return useInfiniteQuery<
    PaginationResult<Notification>,
    Error,
    InfiniteData<PaginationResult<Notification>>,
    unknown[],
    string | undefined
  >({
    enabled: () => Boolean(toValue(userId)),
    getNextPageParam: lastPage => {
      if (lastPage.data.length < NotificationConfig.PAGE_SIZE) return undefined;
      return lastPage.data[lastPage.data.length - 1]?.created_at ?? undefined;
    },
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      getUserNotifications(toValue(userId)!, { before: pageParam }),
    queryKey: ['notifications', 'user', userId],
  });
};
