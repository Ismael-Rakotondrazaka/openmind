<script lang="ts" setup>
import type { User } from '#shared/features/users';

import { useI18n } from 'vue-i18n';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

const { t } = useI18n();

interface Props {
  user: Serialize<User>;
}

const props = defineProps<Props>();

const fullname = useUserFullname(() => props.user, t('users.defaultUsername'));
const imageUrl = useUserImageUrl(() => props.user);
</script>

<template>
  <NuxtLinkLocale
    :to="{ name: 'u-userKey', params: { userKey: user.username || user.id } }"
  >
    <div
      class="hover:bg-muted flex items-center gap-3 rounded-lg p-3 transition-colors"
    >
      <Avatar class="size-10 shrink-0">
        <AvatarImage :src="imageUrl" :alt="fullname" />
        <AvatarFallback>{{ fullname.charAt(0) }}</AvatarFallback>
      </Avatar>
      <div class="min-w-0">
        <p class="truncate font-medium">{{ fullname }}</p>
        <p class="text-muted-foreground text-sm">
          {{ user.postsCount }} {{ t('pagination.posts') }} •
          {{ user.followerCount }} {{ t('pagination.followers') }}
        </p>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<style></style>
