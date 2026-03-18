<script lang="ts" setup>
import type { NotificationPreferenceGroup } from '~/features/shared/notifications/notification-preferences.model';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useGetNotificationPreferences } from '~/features/shared/notifications/composables/useGetNotificationPreferences';
import { useSetNotificationPreference } from '~/features/shared/notifications/composables/useSetNotificationPreference';
import {
  NotificationChannels,
  NotificationPreferenceGroupDescription,
  NotificationPreferenceGroupLabel,
  NotificationPreferenceGroups,
} from '~/features/shared/notifications/notification-preferences.model';

const authUser = useSupabaseUser();

const { data: preferenceMap } = useGetNotificationPreferences(
  () => authUser.value?.sub
);

const { isPending, mutate } = useSetNotificationPreference();

const isEnabled = (
  group: NotificationPreferenceGroup,
  channel: (typeof NotificationChannels)[number]
) => preferenceMap.value?.[group]?.[channel] ?? true;

const onToggle = (
  group: NotificationPreferenceGroup,
  channel: (typeof NotificationChannels)[number],
  enabled: boolean
) => {
  mutate({ channel, enabled, groupName: group });
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Notification Preferences</CardTitle>
      <CardDescription>
        Choose which notifications you want to receive.
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
