<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core';
import { SortOrder } from '#imports';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import Pagination from '../../paginations/components/Pagination.vue';
import FeedTagFilter from '../components/FeedTagFilter.vue';
import PostCard from '../components/PostCard.vue';
import PostCardSkeleton from '../components/PostCardSkeleton.vue';
import { useGetPosts } from '../composables/useGetPosts';
import { PostConfig } from '../post.config';
import { type PostFilters, PostStatus } from '../post.model';

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

const searchQuery = useRouteQuery<string>('search', '');
const searchInput = ref(searchQuery.value);
watchDebounced(searchInput, val => (searchQuery.value = val), {
  debounce: 400,
});

const page = useRouteQuery<number>('page', PostConfig.PAGE_DEFAULT, {
  transform: Number,
});
const limit = useRouteQuery<number>('limit', PostConfig.PAGE_SIZE_DEFAULT, {
  transform: Number,
});

const tagsRaw = useRouteQuery<string>('tags', '');
const selectedTagIds = computed<string[]>({
  get: () => (tagsRaw.value ? tagsRaw.value.split(',').filter(Boolean) : []),
  set: (ids: string[]) => {
    tagsRaw.value = ids.join(',');
  },
});

watch([sort, searchQuery, tagsRaw], () => {
  page.value = PostConfig.PAGE_DEFAULT;
});

watch(page, value => {
  if (!Number.isFinite(value) || value < PostConfig.PAGE_DEFAULT) {
    page.value = PostConfig.PAGE_DEFAULT;
  }
});

watch(limit, value => {
  if (!Number.isFinite(value) || value <= 0) {
    limit.value = PostConfig.PAGE_SIZE_DEFAULT;
    return;
  }

  page.value = PostConfig.PAGE_DEFAULT;
});

const { data, isPending } = useGetPosts(() => ({
  limit: limit.value,
  orderBy: sortBy.value,
  page: page.value,
  search: searchQuery.value || undefined,
  sortOrder: sortOrder.value,
  status: PostStatus.published,
  tagIds: selectedTagIds.value.length ? selectedTagIds.value : undefined,
}));

const posts = computed(() => data.value?.data ?? []);
const totalCount = computed(() => data.value?.count ?? 0);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / limit.value))
);

watch(totalPages, pages => {
  if (page.value > pages) {
    page.value = pages;
  }
});
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <h1 class="mb-4 text-2xl font-bold">Feed</h1>

    <div class="flex flex-wrap items-center gap-2">
      <div class="relative min-w-48 flex-1">
        <Icon
          name="mdi:magnify"
          size="1rem"
          class="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
        />
        <Input
          v-model="searchInput"
          placeholder="Search posts..."
          class="pl-8"
        />
      </div>

      <FeedTagFilter v-model="selectedTagIds" />

      <Select v-model="sort">
        <SelectTrigger class="w-35">
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
    </div>

    <Separator class="my-4" />

    <ul class="">
      <template v-if="isPending">
        <li
          v-for="n in limit"
          :key="n"
          class="border-b pt-4 pb-4 first:pt-0 last:border-b-0"
        >
          <PostCardSkeleton />
        </li>
      </template>
      <template v-else>
        <li
          v-for="post in posts"
          :key="post.id"
          class="border-b pt-4 pb-4 first:pt-0 last:border-b-0"
        >
          <PostCard :post="post" />
        </li>
      </template>
    </ul>

    <Pagination
      class="mt-6"
      :limit="limit"
      :page="page"
      :total-count="totalCount"
      :total-pages="totalPages"
      @page-change="page = $event"
      @page-size-change="limit = $event"
    />
  </div>
</template>

<style scoped></style>
