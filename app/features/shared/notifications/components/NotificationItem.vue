<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';

import { useMutation } from '@pinia/colada';
import { useTimeAgo } from '@vueuse/core';
import {
  type Notification,
  NotificationType,
} from '#shared/features/notifications';
import { useI18n } from 'vue-i18n';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

import { useMarkNotificationsRead } from '../notification.query';

const props = defineProps<{ notification: Serialize<Notification> }>();

const { t } = useI18n();
const { mutate: markRead } = useMutation(useMarkNotificationsRead());
const timeAgo = useTimeAgo(() => new Date(props.notification.createdAt));
const localePath = useLocalePath();

const actorFullname = useUserFullname(
  () => props.notification.actorUser ?? {},
  t('users.defaultUsername')
);
const actorImageUrl = useUserImageUrl(() => props.notification.actorUser ?? {});

const isUnread = computed(() => props.notification.readAt === null);

const notificationLink = computed(() => {
  const { data, type } = props.notification;

  if (type === NotificationType.user_followed) {
    const username =
      props.notification.actorUser?.username ?? props.notification.actorId;
    if (!username) return null;
    return localePath({ name: 'u-userKey', params: { userKey: username } });
  }

  if (data.postSlug && data.postId && data.postAuthorUsername) {
    return localePath({
      name: 'u-userKey-p-postId-postSlug',
      params: {
        postId: data.postId,
        postSlug: data.postSlug,
        userKey: data.postAuthorUsername,
      },
    });
  }

  return null;
});

const actorName = computed(
  () => actorFullname.value || t('notifications.someone')
);

const message = computed(() => {
  const { data, type } = props.notification;
  const name = actorName.value;
  const count = data.actorCount ?? 1;
  const others =
    count > 1 ? ` ${t('notifications.andXOthers', { count: count - 1 })}` : '';

  switch (type) {
    case NotificationType.comment_reacted:
      return `${name}${others} ${t('notifications.reactedToYourComment')}`;
    case NotificationType.comment_replied:
      return `${name} ${t('notifications.repliedToYourComment')}`;
    case NotificationType.post_commented:
      return `${name} ${t('notifications.commentedOnYourPost')}`;
    case NotificationType.post_reacted:
      return `${name}${others} ${t('notifications.reactedToYourPost')}`;
    case NotificationType.user_followed:
      return `${name} ${t('notifications.startedFollowingYou')}`;
    case NotificationType.user_welcomed:
      return t('notifications.welcomeVerified');
    default:
      return `${name} ${t('notifications.interactedWithContent', { fallback: 'interacted with your content' })}`;
  }
});

const handleClick = () => {
  if (isUnread.value) {
    markRead({ body: { ids: [props.notification.id] } });
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
    <NuxtLinkLocale
      v-if="notification.actorUser"
      :to="{
        name: 'u-userKey',
        params: {
          userKey: notification.actorUser.username ?? notification.actorUser.id,
        },
      }"
      class="shrink-0"
      @click.stop
    >
      <Avatar class="size-9">
        <AvatarImage :src="actorImageUrl" :alt="actorName" />
      </Avatar>
    </NuxtLinkLocale>

    <Avatar v-else class="size-9 shrink-0">
      <AvatarImage
        :src="actorImageUrl"
        :alt="t('common.accessibility.userAvatar')"
      />
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
