<script lang="ts" setup>
import { refDebounced } from '@vueuse/core';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Pagination from '~/features/shared/paginations/components/Pagination.vue';
import PostCard from '~/features/shared/posts/components/PostCard.vue';
import { useGetPosts } from '~/features/shared/posts/composables/useGetPosts';
import { useGetTags } from '~/features/shared/tags/composables/useGetTags';

interface Props {
  profileId: string;
}

const props = defineProps<Props>();

const postSearch = ref('');
const debouncedPostSearch = refDebounced(postSearch, 300);
const selectedTagIds = ref<string[]>([]);
const postsPage = ref(1);
const postsLimit = ref(10);

watch([debouncedPostSearch, selectedTagIds], () => {
  postsPage.value = 1;
});

const toggleTag = (tagId: string) => {
  const idx = selectedTagIds.value.indexOf(tagId);
  if (idx === -1) {
    selectedTagIds.value = [...selectedTagIds.value, tagId];
  } else {
    selectedTagIds.value = selectedTagIds.value.filter(id => id !== tagId);
  }
};

const isTagPopoverOpen = ref(false);
const tagSearch = ref('');

const { data: allTagsData } = useGetTags(() => ({ limit: 100 }));
const allTags = computed(() => allTagsData.value?.data ?? []);

const filteredTagOptions = computed(() => {
  const search = tagSearch.value.toLowerCase();
  if (!search) return allTags.value;
  return allTags.value.filter(t => t.value.toLowerCase().includes(search));
});

const selectedTagObjects = computed(() =>
  allTags.value.filter(t => selectedTagIds.value.includes(t.id))
);

const { data: postsData, isPending: isPostsPending } = useGetPosts(() => ({
  author_id: props.profileId,
  limit: postsLimit.value,
  page: postsPage.value,
  search: debouncedPostSearch.value || undefined,
  status: 'published',
  tagIds: selectedTagIds.value.length ? selectedTagIds.value : undefined,
}));

const postsTotalPages = computed(() =>
  Math.ceil((postsData.value?.count ?? 0) / postsLimit.value)
);
</script>

<template>
  <div class="mt-4 flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Input v-model="postSearch" placeholder="Search posts..." />
      <div class="flex flex-wrap items-center gap-2">
        <Popover v-model:open="isTagPopoverOpen">
          <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="gap-1.5">
              <Icon name="mdi:tag-outline" size="1rem" />
              Tags
              <Badge
                v-if="selectedTagIds.length"
                variant="secondary"
                class="px-1.5 py-0 text-xs"
              >
                {{ selectedTagIds.length }}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-56 p-2" align="start">
            <Input
              v-model="tagSearch"
              placeholder="Search tags..."
              class="mb-2 h-8 text-sm"
            />
            <div class="max-h-48 overflow-y-auto">
              <p
                v-if="filteredTagOptions.length === 0"
                class="text-muted-foreground py-3 text-center text-sm"
              >
                No tags found.
              </p>
              <button
                v-for="tag in filteredTagOptions"
                :key="tag.id"
                type="button"
                class="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm"
                @click="toggleTag(tag.id)"
              >
                <Icon
                  name="mdi:check"
                  size="0.875rem"
                  :class="
                    selectedTagIds.includes(tag.id)
                      ? 'opacity-100'
                      : 'opacity-0'
                  "
                />
                {{ tag.value }}
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <Badge
          v-for="tag in selectedTagObjects"
          :key="tag.id"
          variant="secondary"
          class="gap-1 pr-1"
        >
          {{ tag.value }}
          <button
            type="button"
            class="hover:text-destructive ml-0.5 rounded"
            @click="toggleTag(tag.id)"
          >
            <Icon name="mdi:close" size="0.75rem" />
          </button>
        </Badge>
      </div>
    </div>

    <div v-if="isPostsPending" class="text-muted-foreground text-sm">
      Loading...
    </div>
    <template v-else>
      <PostCard v-for="post in postsData?.data" :key="post.id" :post="post" />
      <p
        v-if="!postsData?.data?.length"
        class="text-muted-foreground py-6 text-center text-sm"
      >
        No posts yet.
      </p>
      <Pagination
        v-if="(postsData?.count ?? 0) > postsLimit"
        :limit="postsLimit"
        :page="postsPage"
        :total-count="postsData?.count ?? 0"
        :total-pages="postsTotalPages"
        @page-change="postsPage = $event"
        @page-size-change="postsLimit = $event"
      />
    </template>
  </div>
</template>

<style></style>
