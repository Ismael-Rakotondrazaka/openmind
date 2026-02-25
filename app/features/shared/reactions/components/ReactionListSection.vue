<template>
  <div>
    <ReactionListSkeleton v-if="isPending" />
    <ReactionList v-else-if="data" :reactions="data.data" />
  </div>
</template>

<script lang="ts" setup>
import type { ReactionType } from '../reaction.model';

import { useGetReactionsWithUsers } from '../composables/useGetReactionsWithUsers';
import ReactionList from './ReactionList.vue';
import ReactionListSkeleton from './ReactionListSkeleton.vue';

interface Props {
  commentId?: string;
  postId?: string;
  type?: ReactionType;
}

const props = defineProps<Props>();

const { data, isPending } = useGetReactionsWithUsers(() => ({
  limit: 10,
  page: 1,
  post_id: props.postId,
  type: props.type,
}));
</script>

<style></style>
