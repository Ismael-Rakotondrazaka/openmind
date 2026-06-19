<script lang="ts" setup>
import type { UserTagWithDetails } from '#shared/features/user-tags';
import type { User } from '#shared/features/users';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Props {
  profile: Serialize<User>;
  profileFullname: string;
  profileImageUrl: string;
  tags: Serialize<UserTagWithDetails>[];
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
          :key="userTag.tagId"
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
