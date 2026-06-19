<script lang="ts" setup>
import type { Post } from '#shared/features/posts';

import { useI18n } from 'vue-i18n';

import ReactionsDrawer from '~/features/shared/reactions/components/ReactionsDrawer.vue';
import { useReactionsDrawer } from '~/features/shared/reactions/composables/useReactionsDrawer';
import { getUserFullname } from '~/features/shared/users/composables/useUserFullname';

import { useCommentRealtime } from '../composables/useCommentRealtime';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';

type Props = {
  post: Serialize<Post>;
};

const props = defineProps<Props>();
const { t } = useI18n();

useCommentRealtime(() => props.post.id);

const formTitle = computed(() =>
  t('comments.commentOnPost', {
    name: getUserFullname(props.post.author, t('users.defaultUsername')),
  })
);

const { state: reactionsDrawerState } = useReactionsDrawer();
</script>

<template>
  <div class="mt-10 space-y-6">
    <h2 class="text-xl font-semibold">
      {{ t('comments.heading') }}
      <span
        v-if="post.commentsCount"
        class="text-muted-foreground text-base font-normal"
      >
        ({{ post.commentsCount }})
      </span>
    </h2>

    <CommentList :post-id="post.id" />

    <CommentForm id="comment-form" :post-id="post.id" :title="formTitle" />
  </div>

  <ReactionsDrawer
    v-model:open="reactionsDrawerState.open"
    v-model:selected-reaction-tab="reactionsDrawerState.selectedTab"
    :comment-id="reactionsDrawerState.commentId ?? undefined"
    :reactions-details="reactionsDrawerState.reactionsDetails"
  />
</template>
