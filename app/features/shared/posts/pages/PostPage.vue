<script lang="ts" setup>
import type { Post } from '../post.model';

import PostComments from '../../comments/components/PostComments.vue';
import ReactionsDrawer from '../../reactions/components/ReactionsDrawer.vue';
import { ReactionTypes } from '../../reactions/reaction.model';
import PostContent from '../components/PostContent.vue';
import PostHeader from '../components/PostHeader.vue';
import PostInteraction from '../components/PostInteraction.vue';
import PostIntro from '../components/PostIntro.vue';

const VALID_REACTION_TABS = ['all', ...ReactionTypes] as const;
type ReactionTab = (typeof VALID_REACTION_TABS)[number];

const reactionsDrawerOpen = useRouteQuery<'false' | 'true', boolean>(
  'showReactionsDrawer',
  'false',
  {
    transform: {
      get: val => val === 'true',
      set: val => (val ? 'true' : 'false'),
    },
  }
);

const reactionsTab = useRouteQuery<string, ReactionTab>('reactionsTab', 'all', {
  transform: {
    get: val =>
      VALID_REACTION_TABS.includes(val as ReactionTab)
        ? (val as ReactionTab)
        : 'all',
    set: val => val,
  },
});

defineProps<{ post: Post }>();

const showReactionsDrawer = () => {
  reactionsDrawerOpen.value = true;
};

const hideReactionsDrawer = () => {
  reactionsDrawerOpen.value = false;
};
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <PostHeader :post="post" />
    <PostIntro :post="post" />
    <PostInteraction
      :post="post"
      :reactions-drawer-open="reactionsDrawerOpen"
      @reactions-drawer:open="showReactionsDrawer"
      @reactions-drawer:close="hideReactionsDrawer"
    />
    <PostContent :content="post.content" />
    <PostComments :post="post" />
    <ReactionsDrawer
      v-model:open="reactionsDrawerOpen"
      v-model:selected-reaction-tab="reactionsTab"
      :post-id="post.id"
      :reactions-details="post.reactions_details"
    />
  </div>
</template>

<style scoped></style>
