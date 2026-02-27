<script lang="ts" setup>
import { CommentConfig } from '../comment.config';
import { useGetComments } from '../composables/useGetComments';
import CommentForm from './CommentForm.vue';
import CommentListItem from './CommentListItem.vue';

type Props = {
  parentAuthorName?: string;
  parentId: string;
  postId: string;
  showReplyForm: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  reply: [];
  'reply:cancelled': [];
  'reply:submitted': [];
}>();

const formContainerRef = ref<HTMLElement | null>(null);

watch(
  () => props.showReplyForm,
  async val => {
    if (val) {
      await nextTick();
      setTimeout(() => {
        formContainerRef.value?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 300);
    }
  }
);

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  useGetComments(() => ({
    limit: CommentConfig.PAGE_SIZE_DEFAULT,
    parent_id: props.parentId,
    post_id: props.postId,
  }));

const replies = computed(() =>
  [...(data.value?.pages ?? [])].reverse().flatMap(p => [...p.data].reverse())
);
</script>

<template>
  <div class="pl-11">
    <template v-if="isLoading">
      <div class="bg-muted h-4 w-32 animate-pulse rounded" />
    </template>

    <template v-else>
      <button
        v-if="hasNextPage"
        class="text-muted-foreground hover:text-foreground w-full text-sm transition-colors"
        :disabled="isFetchingNextPage"
        @click="() => fetchNextPage()"
      >
        {{ isFetchingNextPage ? 'Loading...' : 'Load previous replies' }}
      </button>

      <CommentListItem
        v-for="reply in replies"
        :key="reply.id"
        :comment="reply"
        :show-reply-button="true"
        @reply="emit('reply')"
      />
    </template>

    <div v-if="showReplyForm" ref="formContainerRef" class="pb-2">
      <CommentForm
        :post-id="postId"
        :parent-id="parentId"
        :depth="1"
        :title="
          parentAuthorName
            ? `Reply to ${parentAuthorName}'s comment`
            : undefined
        "
        @cancelled="emit('reply:cancelled')"
        @submitted="emit('reply:submitted')"
      />
    </div>
  </div>
</template>
