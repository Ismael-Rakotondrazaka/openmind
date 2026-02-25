<template>
  <div class="flex flex-col gap-4">
    <ReactionListSkeleton v-if="isPending" />
    <ReactionList v-else-if="data" :reactions="data.data" />

    <PaginationSkeleton v-if="isPending" />
    <Pagination
      v-else-if="data && totalPages > 1"
      :limit="limit"
      :page="page"
      :total-count="data.count"
      :total-pages="totalPages"
      @page-change="emit('page:update', $event)"
      @page-size-change="emit('limit:update', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import Pagination from '~/features/shared/paginations/components/Pagination.vue';
import PaginationSkeleton from '~/features/shared/paginations/components/PaginationSkeleton.vue';

import type { ReactionType } from '../reaction.model';

import { useGetReactionsWithUsers } from '../composables/useGetReactionsWithUsers';
import ReactionList from './ReactionList.vue';
import ReactionListSkeleton from './ReactionListSkeleton.vue';

interface Props {
  commentId?: string;
  limit: number;
  page: number;
  postId?: string;
  type?: ReactionType;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'limit:update': [number];
  'page:update': [number];
}>();

const { data, isPending } = useGetReactionsWithUsers(() => ({
  limit: props.limit,
  page: props.page,
  post_id: props.postId,
  type: props.type,
}));

const totalPages = computed(() =>
  Math.ceil((data.value?.count ?? 0) / props.limit)
);
</script>
