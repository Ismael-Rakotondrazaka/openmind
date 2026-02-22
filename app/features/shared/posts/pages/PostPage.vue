<script lang="ts" setup>
import type { RouteNamedMap } from 'vue-router/auto-routes';

import { SortOrder } from '#imports';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { PostFilters } from '../post.model';

import PostCard from '../components/PostCard.vue';
import PostContent from '../components/PostContent.vue';
import PostHeader from '../components/PostHeader.vue';
import PostInteraction from '../components/PostInteraction.vue';
import { useGetPost } from '../composables/useGetPost';
import { useGetPosts } from '../composables/useGetPosts';

const SortOptions = ['recent', 'top'] as const;

const SortOption = createEnumConstants(SortOptions);

type SortOption = (typeof SortOption)[keyof typeof SortOption];

const SortLabel: Record<SortOption, string> = {
  [SortOption.recent]: 'Recent',
  [SortOption.top]: 'Top',
};

const sort = useRouteQuery<SortOption>('sort', SortOption.recent);

const route = useRoute('u-userKey-p-postId-postSlug');

const sortOrderMap: Record<
  SortOption,
  {
    orderBy: PostFilters['orderBy'];
    sortOrder: SortOrder;
  }
> = {
  [SortOption.recent]: {
    orderBy: 'created_at',
    sortOrder: SortOrder.desc,
  },
  [SortOption.top]: {
    orderBy: 'reactions_count',
    sortOrder: SortOrder.desc,
  },
};

const sortBy = computed<PostFilters['orderBy']>(
  () => sortOrderMap[sort.value].orderBy
);
const sortOrder = computed<SortOrder>(() => sortOrderMap[sort.value].sortOrder);

const { data } = useGetPost(() => route.params.postId);
</script>

<template>
  <div v-if="data" class="mx-auto mt-15 min-h-svh w-full max-w-175">
    <PostHeader :post="data" />
    <PostContent :post="data" />
    <PostInteraction :post="data" />
  </div>
</template>

<style scoped></style>
