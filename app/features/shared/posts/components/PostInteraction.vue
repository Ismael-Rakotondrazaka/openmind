<script lang="ts" setup>
import type { PostView } from '#shared/features/posts';

import PostReactionActions from './PostReactionActions.vue';
import PostReactionsSummary from './PostReactionsSummary.vue';
import PostSharePopover from './PostSharePopover.vue';

type Props = {
  post: Serialize<PostView>;
  reactionsDrawerOpen: boolean;
};

const emit = defineEmits<{
  'reactions-drawer:close': [];
  'reactions-drawer:open': [];
}>();

defineProps<Props>();
</script>

<template>
  <div class="mb-2">
    <PostReactionsSummary
      :post="post"
      @reactions-drawer:open="emit('reactions-drawer:open')"
    />

    <div class="flex flex-row flex-nowrap items-center justify-between">
      <PostReactionActions :post="post" />
      <PostSharePopover :post="post" />
    </div>
  </div>
</template>
