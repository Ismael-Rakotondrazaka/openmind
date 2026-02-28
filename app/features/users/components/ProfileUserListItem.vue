<script lang="ts" setup>
import type { User } from '~/features/shared/users/user.model';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

interface Props {
  user: User;
}

const props = defineProps<Props>();

const fullname = useUserFullname(() => props.user);
const imageUrl = useUserImageUrl(() => props.user);
</script>

<template>
  <NuxtLink :to="`/u/${user.username || user.id}`">
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
          {{ user.posts_count }} posts • {{ user.follower_count }} followers
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<style></style>
