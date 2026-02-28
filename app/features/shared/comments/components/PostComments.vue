<script lang="ts" setup>
import type { Post } from '~/features/shared/posts/post.model';

import { getUserFullname } from '~/features/shared/users/composables/useUserFullname';

import { useCommentRealtime } from '../composables/useCommentRealtime';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';

type Props = {
  post: Post;
};

const props = defineProps<Props>();

useCommentRealtime(() => props.post.id);

const formTitle = computed(
  () => `Comment on ${getUserFullname(props.post.author)}'s post`
);
</script>

<template>
  <div class="mt-10 space-y-6">
    <h2 class="text-xl font-semibold">
      Comments
      <span
        v-if="post.comments_count"
        class="text-muted-foreground text-base font-normal"
      >
        ({{ post.comments_count }})
      </span>
    </h2>

    <CommentList :post-id="post.id" />

    <CommentForm id="comment-form" :post-id="post.id" :title="formTitle" />
  </div>
</template>
