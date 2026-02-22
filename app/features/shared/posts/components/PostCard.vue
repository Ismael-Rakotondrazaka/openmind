<template>
  <div class="hover:bg-muted rounded-lg p-4">
    <PostCardHeader :post="post" />
    <PostCardContent :post="post" />
    <PostCardFooter :post="post" />
  </div>
</template>

<script lang="ts" setup>
import type { Post } from '../post.model';

import PostCardContent from './PostCardContent.vue';
import PostCardFooter from './PostCardFooter.vue';
import PostCardHeader from './PostCardHeader.vue';
interface Props {
  post: Post;
}

defineProps<Props>();
</script>

<style></style>
