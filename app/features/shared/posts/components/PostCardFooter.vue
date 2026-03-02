<template>
  <div>
    <PostInteraction
      :post="post"
      :reactions-drawer-open="reactionsDrawerOpen"
      @reactions-drawer:open="reactionsDrawerOpen = true"
      @reactions-drawer:close="reactionsDrawerOpen = false"
    />
    <ReactionsDrawer
      v-model:open="reactionsDrawerOpen"
      :post-id="post.id"
      :reactions-details="post.reactions_details"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Post } from '../post.model';

import ReactionsDrawer from '../../reactions/components/ReactionsDrawer.vue';
import PostInteraction from './PostInteraction.vue';

type Props = {
  post: Post;
};

defineProps<Props>();

const reactionsDrawerOpen = ref(false);
</script>
