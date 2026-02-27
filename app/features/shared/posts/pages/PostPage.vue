<script lang="ts" setup>
import PostComments from '../../comments/components/PostComments.vue';
import ReactionsDrawer from '../../reactions/components/ReactionsDrawer.vue';
import { ReactionTypes } from '../../reactions/reaction.model';
import PostContent from '../components/PostContent.vue';
import PostHeader from '../components/PostHeader.vue';
import PostInteraction from '../components/PostInteraction.vue';
import PostIntro from '../components/PostIntro.vue';
import { useGetPost } from '../composables/useGetPost';

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

const route = useRoute('u-userKey-p-postId-postSlug');

const showReactionsDrawer = () => {
  reactionsDrawerOpen.value = true;
};

const hideReactionsDrawer = () => {
  reactionsDrawerOpen.value = false;
};

const { data } = useGetPost(() => route.params.postId);
</script>

<template>
  <div v-if="data" class="mx-auto mt-15 min-h-svh w-full max-w-175">
    <PostHeader :post="data" />
    <PostIntro :post="data" />
    <PostInteraction
      :post="data"
      :reactions-drawer-open="reactionsDrawerOpen"
      @reactions-drawer:open="showReactionsDrawer"
      @reactions-drawer:close="hideReactionsDrawer"
    />
    <PostContent :content="data.content" />
    <PostComments :post="data" />
    <ReactionsDrawer
      v-model:open="reactionsDrawerOpen"
      v-model:selected-reaction-tab="reactionsTab"
      :post-id="data.id"
      :reactions-details="data.reactions_details"
    />
  </div>
</template>

<style scoped></style>
