<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { getUserFullname } from '~/features/shared/users/composables/useUserFullname';

import { useCommentList } from '../composables/useCommentList';
import CommentListItem from './CommentListItem.vue';
import CommentReplies from './CommentReplies.vue';

type Props = {
  postId: string;
};

const props = defineProps<Props>();
const { t } = useI18n();

const replyingTo = ref<null | string>(null);

const { comments, hasMore, isLoading, isLoadingMore, loadPrevious } =
  useCommentList(() => props.postId);

const handleReply = (commentId: string) => {
  replyingTo.value = replyingTo.value === commentId ? null : commentId;
};
</script>

<template>
  <div>
    <template v-if="isLoading">
      <div v-for="i in 3" :key="i" class="flex gap-3">
        <div class="bg-muted size-8 shrink-0 animate-pulse rounded-full" />
        <div class="flex flex-1 flex-col gap-2">
          <div class="bg-muted h-3 w-24 animate-pulse rounded" />
          <div class="bg-muted h-4 w-full animate-pulse rounded" />
          <div class="bg-muted h-4 w-3/4 animate-pulse rounded" />
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="hasMore" class="mb-4 flex justify-center">
        <button
          class="text-muted-foreground hover:text-foreground text-sm transition-colors disabled:opacity-50"
          :disabled="isLoadingMore"
          @click="loadPrevious"
        >
          <span v-if="isLoadingMore" class="flex items-center gap-1.5">
            <span class="size-3 animate-spin rounded-full border border-current border-t-transparent" />
            {{ t('comments.loadPrevious') }}
          </span>
          <span v-else>{{ t('comments.loadPrevious') }}</span>
        </button>
      </div>

      <template v-if="comments.length">
        <div v-for="comment in comments" :key="comment.id">
          <CommentListItem
            :comment="comment"
            :show-reply-button="true"
            @reply="() => handleReply(comment.id)"
          />
          <CommentReplies
            :parent-id="comment.id"
            :post-id="postId"
            :show-reply-form="replyingTo === comment.id"
            :parent-author-name="getUserFullname(comment.author)"
            @reply="handleReply(comment.id)"
            @reply:cancelled="replyingTo = null"
            @reply:submitted="replyingTo = null"
          />
        </div>
      </template>

      <p v-else class="text-muted-foreground text-sm">
        {{ t('comments.noCommentsYet') }}
      </p>
    </template>
  </div>
</template>
