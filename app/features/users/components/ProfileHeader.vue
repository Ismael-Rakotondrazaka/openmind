<script lang="ts" setup>
import type { UserTagWithDetails } from '~/features/shared/user-tags/user-tag.model';
import type { User } from '~/features/shared/users/user.model';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Props {
  profile: User;
  profileFullname: string;
  profileImageUrl: string;
  tags: UserTagWithDetails[];
}

defineProps<Props>();
</script>

<template>
  <div class="mb-6 flex flex-col items-center gap-3">
    <Avatar class="size-20">
      <AvatarImage :src="profileImageUrl" :alt="profileFullname" />
      <AvatarFallback>{{ profileFullname.charAt(0) }}</AvatarFallback>
    </Avatar>

    <div class="text-center">
      <h1 class="text-xl font-bold">{{ profileFullname }}</h1>
      <p class="text-muted-foreground mb-2 text-sm">
        {{ profile.username }}
      </p>
      <div v-if="tags.length > 0" class="flex flex-wrap gap-2">
        <Badge
          v-for="userTag in tags"
          :key="userTag.tag_id"
          variant="secondary"
          class="rounded-full"
        >
          {{ userTag.tag.value }}
        </Badge>
      </div>
    </div>
  </div>
</template>

<style></style>
