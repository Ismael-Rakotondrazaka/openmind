<template>
  <div>
    <ReactionList v-if="data" :reactions="data.data" />
  </div>
</template>

<script lang="ts" setup>
import type { ReactionType } from '../reaction.model';

import { useGetReactionsWithUsers } from '../composables/useGetReactionsWithUsers';
import ReactionList from './ReactionList.vue';

interface Props {
  commentId?: string;
  postId?: string;
  type?: ReactionType;
}

const props = defineProps<Props>();

const { data } = useGetReactionsWithUsers(() => ({
  limit: 10,
  page: 1,
  post_id: props.postId,
  type: props.type,
}));
</script>

<style></style>
