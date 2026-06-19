<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { useCommentList } from '../composables/useCommentList';
import CommentForm from './CommentForm.vue';
import CommentListItem from './CommentListItem.vue';

type Props = {
  parentAuthorName?: string;
  parentId: string;
  postId: string;
  showReplyForm: boolean;
};

const props = defineProps<Props>();

const { t } = useI18n();

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

const { comments, hasMore, isLoading, isLoadingMore, loadPrevious } =
  useCommentList(
    () => props.postId,
    () => props.parentId
  );
</script>

<template>
  <div class="pl-11">
    <template v-if="isLoading">
      <div class="bg-muted h-4 w-32 animate-pulse rounded" />
    </template>

    <template v-else>
      <div v-if="hasMore" class="mb-2 flex justify-start">
        <button
          class="text-muted-foreground hover:text-foreground text-xs transition-colors disabled:opacity-50"
          :disabled="isLoadingMore"
          @click="loadPrevious"
        >
          <span v-if="isLoadingMore" class="flex items-center gap-1.5">
            <span class="size-2.5 animate-spin rounded-full border border-current border-t-transparent" />
            {{ t('comments.loadPreviousReplies') }}
          </span>
          <span v-else>{{ t('comments.loadPreviousReplies') }}</span>
        </button>
      </div>

      <CommentListItem
        v-for="reply in comments"
        :key="reply.id"
        :comment="reply"
        :show-reply-button="true"
        @reply="() => emit('reply')"
      />
    </template>

    <div v-if="showReplyForm" ref="formContainerRef" class="pb-2">
      <CommentForm
        :post-id="postId"
        :parent-id="parentId"
        :depth="1"
        :title="
          parentAuthorName
            ? t('comments.replyToAuthorComment', {
                author: parentAuthorName,
              })
            : undefined
        "
        @cancelled="emit('reply:cancelled')"
        @submitted="emit('reply:submitted')"
      />
    </div>
  </div>
</template>
