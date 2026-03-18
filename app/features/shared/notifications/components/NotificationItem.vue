<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';

import { useTimeAgo } from '@vueuse/core';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

import type { Notification } from '../notification.model';

import { useMarkNotificationRead } from '../composables/useMarkNotificationRead';
import { NotificationType } from '../notification.model';

const props = defineProps<{ notification: Notification }>();

const { mutate: markRead } = useMarkNotificationRead();
const timeAgo = useTimeAgo(() => new Date(props.notification.created_at));

const actorFullname = useUserFullname(() => props.notification.actor ?? {});
const actorImageUrl = useUserImageUrl(() => props.notification.actor ?? {});

const isUnread = computed(() => props.notification.read_at === null);

const notificationLink = computed(() => {
  const { data, type } = props.notification;

  if (type === NotificationType.user_followed) {
    const username =
      props.notification.actor?.username ?? props.notification.actor_id;
    if (!username) return null;
    return { name: 'u-userKey', params: { userKey: username } };
  }

  if (data.post_slug && data.post_id && data.post_author_username) {
    return {
      name: 'u-userKey-p-postId-postSlug',
      params: {
        postId: data.post_id,
        postSlug: data.post_slug,
        userKey: data.post_author_username,
      },
    };
  }

  return null;
});

const actorName = computed(() => actorFullname.value || 'Someone');

const message = computed(() => {
  const { data, type } = props.notification;
  const name = actorName.value;
  const count = data.actor_count ?? 1;
  const others =
    count > 1 ? ` and ${count - 1} other${count - 1 > 1 ? 's' : ''}` : '';

  switch (type) {
    case NotificationType.comment_reacted:
      return `${name}${others} reacted to your comment`;
    case NotificationType.comment_replied:
      return `${name} replied to your comment`;
    case NotificationType.post_commented:
      return `${name} commented on your post`;
    case NotificationType.post_reacted:
      return `${name}${others} reacted to your post`;
    case NotificationType.user_followed:
      return `${name} started following you`;
    case NotificationType.user_welcomed:
      return 'Welcome! Your account has been verified.';
    default:
      return `${name} interacted with your content`;
  }
});

const handleClick = () => {
  if (isUnread.value) {
    markRead(props.notification.id);
  }
  if (notificationLink.value) {
    navigateTo(notificationLink.value as RouteLocationRaw);
  }
};
</script>

<template>
  <div
    class="hover:bg-muted flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors"
    :class="{ 'bg-muted/50': isUnread }"
    @click="handleClick"
  >
    <NuxtLink
      v-if="notification.actor"
      :to="{
        name: 'u-userKey',
        params: {
          userKey: notification.actor.username ?? notification.actor.id,
        },
      }"
      class="shrink-0"
      @click.stop
    >
      <Avatar class="size-9">
        <AvatarImage :src="actorImageUrl" :alt="actorName" />
      </Avatar>
    </NuxtLink>

    <Avatar v-else class="size-9 shrink-0">
      <AvatarImage :src="actorImageUrl" alt="User" />
    </Avatar>

    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <p class="text-sm leading-snug">
        {{ message }}
      </p>
      <span class="text-muted-foreground text-xs">{{ timeAgo }}</span>
    </div>

    <div
      v-if="isUnread"
      class="bg-primary mt-1.5 size-2 shrink-0 rounded-full"
    />
  </div>
</template>
