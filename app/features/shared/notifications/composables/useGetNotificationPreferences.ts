import type { MaybeRefOrGetter } from 'vue';

import type { NotificationPreferenceMap } from '../notification-preferences.model';

import {
  NotificationChannels,
  NotificationPreferenceGroups,
} from '../notification-preferences.model';
import { getNotificationPreferences } from '../notification-preferences.service';

export const useGetNotificationPreferences = (
  userId: MaybeRefOrGetter<string | undefined>
) => {
  return useQuery({
    enabled: () => Boolean(toValue(userId)),
    queryFn: () => getNotificationPreferences(toValue(userId)!),
    queryKey: ['notification-preferences', userId],
    select: rows => {
      const map = Object.fromEntries(
        NotificationPreferenceGroups.map(g => [
          g,
          Object.fromEntries(NotificationChannels.map(c => [c, true])),
        ])
      ) as NotificationPreferenceMap;

      for (const row of rows) {
        const group = row.group_name as keyof NotificationPreferenceMap;
        const channel = row.channel as (typeof NotificationChannels)[number];
        if (group in map && channel in map[group]) {
          map[group][channel] = row.enabled;
        }
      }

      return map;
    },
  });
};
