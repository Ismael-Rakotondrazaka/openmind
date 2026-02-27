<script lang="ts" setup>
import type { Post } from '~/features/shared/posts/post.model';

import { useCommentRealtime } from '../composables/useCommentRealtime';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';

type Props = {
  post: Post;
};

const props = defineProps<Props>();

useCommentRealtime(() => props.post.id);
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

    <CommentForm :post-id="post.id" />
  </div>
</template>
