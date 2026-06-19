<template>
  <div>
    <PostInteraction
      :post="post"
      :reactions-drawer-open="reactionsDrawerOpen"
      @reactions-drawer:open="onOpenReactions"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PostListItem, PostReactionsDetails } from '#shared/features/posts';

import { useReactionsDrawer } from '../../reactions/composables/useReactionsDrawer';
import PostInteraction from './PostInteraction.vue';

type Props = {
  post: Serialize<PostListItem>;
};

const props = defineProps<Props>();

const { openForPost, state } = useReactionsDrawer();
const reactionsDrawerOpen = computed(
  () => state.open && state.postId === props.post.id
);

function onOpenReactions() {
  openForPost(
    props.post.id,
    props.post.reactionsDetails as PostReactionsDetails
  );
}
</script>
