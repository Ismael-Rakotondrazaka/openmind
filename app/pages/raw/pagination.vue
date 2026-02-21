<template>
  <div class="container max-w-4xl space-y-12 py-10">
    <div>
      <h1 class="mb-2 text-2xl font-semibold">Pagination (raw test)</h1>
      <p class="text-muted-foreground mb-6 text-sm">
        Interactive pagination with page and page size controls.
      </p>
      <Pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total-count="totalCount"
        :total-pages="totalPages"
        @page-change="currentPage = $event"
        @page-size-change="onPageSizeChange"
      />
      <p class="text-muted-foreground mt-4 text-sm">
        Current page: {{ currentPage }}, page size: {{ pageSize }}, total:
        {{ totalCount }}.
      </p>
    </div>

    <div>
      <h2 class="mb-2 text-lg font-semibold">Pagination skeleton</h2>
      <p class="text-muted-foreground mb-6 text-sm">
        Loading placeholder for the pagination bar.
      </p>
      <PaginationSkeleton />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import Pagination from '@/features/shared/paginations/components/Pagination.vue';
import PaginationSkeleton from '@/features/shared/paginations/components/PaginationSkeleton.vue';

const totalCount = 237;
const currentPage = ref(1);
const pageSize = ref(20);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount / pageSize.value))
);

function onPageSizeChange(size: number) {
  pageSize.value = size;
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
}
</script>
