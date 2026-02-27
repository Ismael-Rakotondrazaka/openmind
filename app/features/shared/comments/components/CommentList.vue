<script lang="ts" setup>
import { useGetComments } from '../composables/useGetComments';
import CommentListItem from './CommentListItem.vue';
import CommentReplies from './CommentReplies.vue';

type Props = {
  postId: string;
};

const props = defineProps<Props>();

const replyingTo = ref<null | string>(null);

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  useGetComments(() => ({
    limit: 1, // TODO Change to 10
    parent_id: null,
    post_id: props.postId,
  }));

const comments = computed(() =>
  [...(data.value?.pages ?? [])].reverse().flatMap(p => [...p.data].reverse())
);

const handleReply = (commentId: string) => {
  replyingTo.value = replyingTo.value === commentId ? null : commentId;
};
</script>

<template>
  <div class="space-y-6">
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
      <button
        v-if="hasNextPage"
        class="text-muted-foreground hover:text-foreground w-full text-sm transition-colors"
        :disabled="isFetchingNextPage"
        @click="() => fetchNextPage()"
      >
        {{ isFetchingNextPage ? 'Loading...' : 'Load previous comments' }}
      </button>

      <template v-if="comments.length">
        <div v-for="comment in comments" :key="comment.id" class="space-y-1">
          <CommentListItem
            :comment="comment"
            :show-reply-button="true"
            @reply="handleReply(comment.id)"
          />
          <CommentReplies
            :parent-id="comment.id"
            :post-id="postId"
            :show-reply-form="replyingTo === comment.id"
            @reply="handleReply(comment.id)"
            @reply-submitted="replyingTo = null"
          />
        </div>
      </template>

      <p v-else class="text-muted-foreground text-sm">
        No comments yet. Be the first to comment!
      </p>
    </template>
  </div>
</template>
