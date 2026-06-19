<template>
  <NuxtLinkLocale
    :to="{
      name: 'u-userKey',
      params: { userKey: reaction.user.username || reaction.user.id },
    }"
    class="group flex items-center gap-3"
  >
    <div class="relative">
      <Avatar class="size-10 shrink-0">
        <AvatarImage :src="userImageUrl" />
      </Avatar>
      <div
        class="bg-primary text-primary-foreground absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full"
      >
        <Icon :name="ReactionStatusIcon.active[reaction.type]" size="0.6rem" />
      </div>
    </div>
    <span
      class="group-hover:text-primary min-w-0 truncate font-medium group-hover:underline"
      >{{ userFullname }}</span
    >
  </NuxtLinkLocale>
</template>

<script lang="ts" setup>
import {
  ReactionStatusIcon,
  type ReactionWithUser,
} from '#shared/features/reactions';
import { useI18n } from 'vue-i18n';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

interface props {
  reaction: Serialize<ReactionWithUser>;
}

const { t } = useI18n();
const props = defineProps<props>();

const userImageUrl = useUserImageUrl(() => props.reaction.user);
const userFullname = useUserFullname(
  () => props.reaction.user,
  t('users.defaultUsername')
);
</script>

<style></style>
