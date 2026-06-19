<script lang="ts" setup>
import { useQuery } from '@pinia/colada';
import { watchDebounced } from '@vueuse/core';
import { PostConfig, PostStatus } from '#shared/features/posts';
import { useI18n } from 'vue-i18n';

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
import ReactionsDrawer from '../../reactions/components/ReactionsDrawer.vue';
import { useReactionsDrawer } from '../../reactions/composables/useReactionsDrawer';
import FeedTagFilter from '../components/FeedTagFilter.vue';
import PostCard from '../components/PostCard.vue';
import PostCardSkeleton from '../components/PostCardSkeleton.vue';
import { postListQuery } from '../post.query';

const SortOptions = ['recent', 'top'] as const;

const SortOption = createEnumConstants(SortOptions);

type SortOption = (typeof SortOption)[keyof typeof SortOption];

const { t } = useI18n();

const SortLabel: Record<SortOption, string> = {
  [SortOption.recent]: t('posts.recent'),
  [SortOption.top]: t('posts.top'),
};

const sort = useRouteQuery<SortOption>('sort', SortOption.recent);

const sortOrderMap: Record<
  SortOption,
  {
    orderBy: 'createdAt' | 'reactionsCount';
    sortOrder: 'asc' | 'desc';
  }
> = {
  [SortOption.recent]: {
    orderBy: 'createdAt',
    sortOrder: 'desc',
  },
  [SortOption.top]: {
    orderBy: 'reactionsCount',
    sortOrder: 'desc',
  },
};

const sortBy = computed(() => sortOrderMap[sort.value].orderBy);
const sortOrder = computed(() => sortOrderMap[sort.value].sortOrder);

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

const fetchFn = useRequestFetch();

const { data, isPending } = useQuery(() =>
  postListQuery({
    fetchFn,
    orderBy: sortBy.value,
    page: page.value,
    pageSize: limit.value,
    search: searchQuery.value || undefined,
    sortOrder: sortOrder.value,
    status: PostStatus.published,
    tagIds: selectedTagIds.value.length ? selectedTagIds.value : undefined,
  })
);

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

const { state: reactionsDrawerState } = useReactionsDrawer();
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <h1 class="mb-4 text-2xl font-bold">{{ t('posts.feedTitle') }}</h1>

    <div class="flex flex-wrap items-center gap-2">
      <div class="relative min-w-48 flex-1">
        <Icon
          name="mdi:magnify"
          size="1rem"
          class="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
        />
        <Input
          v-model="searchInput"
          :placeholder="t('posts.searchPosts')"
          class="pl-8"
        />
      </div>

      <FeedTagFilter v-model="selectedTagIds" />

      <Select v-model="sort">
        <SelectTrigger class="w-35">
          <SelectValue :placeholder="t('posts.sortBy')" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{{ t('posts.sortBy') }}</SelectLabel>
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

  <ReactionsDrawer
    v-model:open="reactionsDrawerState.open"
    v-model:selected-reaction-tab="reactionsDrawerState.selectedTab"
    :post-id="reactionsDrawerState.postId ?? undefined"
    :reactions-details="reactionsDrawerState.reactionsDetails"
  />
</template>

<style scoped></style>
