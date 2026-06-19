<script lang="ts" setup>
import { useMutation, useQuery } from '@pinia/colada';
import { useI18n } from 'vue-i18n';

import type {
  NotificationPreferenceGroup,
  NotificationPreferenceMap,
} from '~/features/shared/notifications/notification-preferences.model';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  NotificationChannels,
  NotificationPreferenceGroupDescription,
  NotificationPreferenceGroupLabel,
  NotificationPreferenceGroups,
} from '~/features/shared/notifications/notification-preferences.model';
import {
  notificationPreferencesQuery,
  useUpdateNotificationPreference,
} from '~/features/shared/notifications/notification.query';

const { t } = useI18n();
const fetchFn = useRequestFetch();

const { data: preferencesData } = useQuery(() =>
  notificationPreferencesQuery({ fetchFn })
);

const preferenceMap = computed<NotificationPreferenceMap>(() => {
  const rows =
    (preferencesData.value as Array<{
      channel: string;
      enabled: boolean;
      groupName: string;
    }> | null) ?? [];

  const map = Object.fromEntries(
    NotificationPreferenceGroups.map(g => [
      g,
      Object.fromEntries(NotificationChannels.map(c => [c, true])),
    ])
  ) as NotificationPreferenceMap;

  for (const row of rows) {
    const group = row.groupName as keyof NotificationPreferenceMap;
    const channel = row.channel as (typeof NotificationChannels)[number];
    if (group in map && channel in map[group]) {
      map[group][channel] = row.enabled;
    }
  }

  return map;
});

const { isLoading: isPending, mutate } = useMutation(
  useUpdateNotificationPreference()
);

const isEnabled = (
  group: NotificationPreferenceGroup,
  channel: (typeof NotificationChannels)[number]
) => preferenceMap.value?.[group]?.[channel] ?? true;

const onToggle = (
  group: NotificationPreferenceGroup,
  channel: (typeof NotificationChannels)[number],
  enabled: boolean
) => {
  mutate({ body: { channel, enabled, groupName: group } });
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('users.notificationPreferences') }}</CardTitle>
      <CardDescription>
        {{ t('users.notificationPreferencesDescription') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="divide-y">
        <div
          v-for="group in NotificationPreferenceGroups"
          :key="group"
          class="flex items-center justify-between py-4 first:pt-0 last:pb-0"
        >
          <div class="space-y-0.5">
            <p class="text-sm font-medium">
              {{ NotificationPreferenceGroupLabel[group] }}
            </p>
            <p class="text-muted-foreground text-xs">
              {{ NotificationPreferenceGroupDescription[group] }}
            </p>
          </div>

          <div class="flex items-center gap-6">
            <div
              v-for="channel in NotificationChannels"
              :key="channel"
              class="flex flex-col items-center gap-1"
            >
              <span class="text-muted-foreground text-xs capitalize">
                {{ channel.replace('_', ' ') }}
              </span>
              <Switch
                :model-value="isEnabled(group, channel)"
                :disabled="isPending"
                @update:model-value="
                  (val: boolean) => onToggle(group, channel, val)
                "
              />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
