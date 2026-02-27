<!-- eslint-disable vue/no-v-html -->
<script lang="ts" setup>
import { useTimeAgo } from '@vueuse/core';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

import type { Comment } from '../comment.model';

type Props = {
  comment: Comment;
  showReplyButton?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{ reply: [] }>();

const userFullname = useUserFullname(() => props.comment.author);
const userImageUrl = useUserImageUrl(() => props.comment.author);
const timeAgo = useTimeAgo(() => new Date(props.comment.created_at));
const renderedContent = useRenderEditorHTML(() => props.comment.content);
</script>

<template>
  <div class="flex gap-3">
    <NuxtLink
      :to="{
        name: 'u-userKey',
        params: { userKey: comment.author.username || comment.author.id },
      }"
      class="shrink-0"
    >
      <Avatar class="size-8">
        <AvatarImage :src="userImageUrl" />
      </Avatar>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-1">
      <div class="flex items-baseline gap-2">
        <NuxtLink
          :to="{
            name: 'u-userKey',
            params: { userKey: comment.author.username || comment.author.id },
          }"
          class="text-sm font-semibold hover:underline"
        >
          {{ userFullname }}
        </NuxtLink>
        <span class="text-muted-foreground text-xs">{{ timeAgo }}</span>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="prose prose-sm max-w-none" v-html="renderedContent" />

      <button
        v-if="showReplyButton"
        class="text-muted-foreground hover:text-foreground self-start text-xs font-medium transition-colors"
        type="button"
        @click="emit('reply')"
      >
        Reply
      </button>
    </div>
  </div>
</template>
