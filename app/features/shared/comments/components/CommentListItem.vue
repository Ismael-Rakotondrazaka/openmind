<!-- eslint-disable vue/no-v-html -->
<script lang="ts" setup>
import { useTimeAgo } from '@vueuse/core';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

import type { ReactionTypes } from '../../reactions/reaction.model';
import type { Comment } from '../comment.model';

import ReactionsDrawer from '../../reactions/components/ReactionsDrawer.vue';
import CommentReactionActions from './CommentReactionActions.vue';
import CommentReactionsSummary from './CommentReactionsSummary.vue';

type Props = {
  comment: Comment;
  showReplyButton?: boolean;
};

type ReactionTab = 'all' | (typeof ReactionTypes)[number];

const props = defineProps<Props>();

const emit = defineEmits<{ reply: [] }>();

const userFullname = useUserFullname(() => props.comment.author);
const userImageUrl = useUserImageUrl(() => props.comment.author);
const timeAgo = useTimeAgo(() => new Date(props.comment.created_at));
const renderedContent = useRenderEditorHTML(() => props.comment.content);

const reactionsDrawerOpen = ref(false);
const reactionsTab = ref<ReactionTab>('all');
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

      <CommentReactionsSummary
        :comment="comment"
        @reactions-drawer:open="reactionsDrawerOpen = true"
      />

      <div class="flex items-center gap-2">
        <CommentReactionActions :comment="comment" />
        <button
          v-if="showReplyButton"
          class="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
          type="button"
          @click="emit('reply')"
        >
          Reply
        </button>
      </div>
    </div>
  </div>

  <ReactionsDrawer
    v-model:open="reactionsDrawerOpen"
    v-model:selected-reaction-tab="reactionsTab"
    :comment-id="comment.id"
    :reactions-details="comment.reactions_details"
  />
</template>
