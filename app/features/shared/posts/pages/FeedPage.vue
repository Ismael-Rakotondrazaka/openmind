<script lang="ts" setup>
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
import { useGetPosts } from '../composables/useGetPosts';

const SortOptions = ['recent', 'top'] as const;

const SortOption = createEnumConstants(SortOptions);

type SortOption = (typeof SortOption)[keyof typeof SortOption];

const SortLabel: Record<SortOption, string> = {
  [SortOption.recent]: 'Recent',
  [SortOption.top]: 'Top',
};

const sort = useRouteQuery<SortOption>('sort', SortOption.recent);

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

const { data } = useGetPosts(() => ({
  orderBy: sortBy.value,
  sortOrder: sortOrder.value,
}));

const posts = computed(() => data.value?.data ?? []);
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <h1 class="mb-4 text-2xl font-bold">Feed</h1>

    <Select v-model="sort">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          <SelectItem
            v-for="option in SortOptions"
            :key="option"
            :value="option"
          >
            {{ SortLabel[option] }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Separator class="my-2" />

    <ul class="">
      <li
        v-for="post in posts"
        :key="post.id"
        class="border-b pt-4 pb-4 first:pt-0 last:border-b-0"
      >
        <PostCard :post="post" />
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
