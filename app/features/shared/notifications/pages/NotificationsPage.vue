<script lang="ts" setup>
import { Button } from '@/components/ui/button';

import NotificationItem from '../components/NotificationItem.vue';
import NotificationItemSkeleton from '../components/NotificationItemSkeleton.vue';
import { useGetUserNotifications } from '../composables/useGetUserNotifications';
import { useMarkAllNotificationsRead } from '../composables/useMarkAllNotificationsRead';

const authUser = useSupabaseUser();

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
  useGetUserNotifications(() => authUser.value?.sub);

const { isPending: isMarkingAll, mutate: markAllRead } =
  useMarkAllNotificationsRead();

const notifications = computed(
  () => data.value?.pages.flatMap(p => p.data) ?? []
);

const hasUnread = computed(() =>
  notifications.value.some(n => n.read_at === null)
);

const unreadCount = computed(
  () => notifications.value.filter(n => n.read_at === null).length
);
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Notifications
        <span
          v-if="unreadCount > 0"
          class="text-muted-foreground text-xl font-normal"
          >({{ unreadCount }})</span
        >
      </h1>

      <Button
        v-if="hasUnread"
        variant="ghost"
        size="sm"
        :disabled="isMarkingAll"
        @click="markAllRead()"
      >
        <Icon v-if="isMarkingAll" name="mdi:loading" class="animate-spin" />
        Mark all as read
      </Button>
    </div>

    <div class="flex flex-col gap-1">
      <template v-if="isPending">
        <NotificationItemSkeleton v-for="i in 8" :key="i" />
      </template>

      <template v-else-if="notifications.length">
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
        />

        <div v-if="hasNextPage" class="flex justify-center pt-4">
          <Button
            variant="outline"
            :disabled="isFetchingNextPage"
            @click="fetchNextPage()"
          >
            <Icon
              v-if="isFetchingNextPage"
              name="mdi:loading"
              class="animate-spin"
            />
            Load more
          </Button>
        </div>
      </template>

      <div
        v-else
        class="text-muted-foreground flex flex-col items-center gap-2 py-16 text-center"
      >
        <Icon name="mdi:bell-outline" size="2.5rem" />
        <p class="text-sm">No notifications yet</p>
      </div>
    </div>
  </div>
</template>
