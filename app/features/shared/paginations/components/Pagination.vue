<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { computed } from 'vue';

import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface Props {
  class?: HTMLAttributes['class'];
  currentPage: number;
  itemLabel?: string;
  itemLabelPlural?: string;
  ofLabel?: string;
  pageSize: number;
  pageSizeOptions?: number[];
  rowsPerPageLabel?: string;
  siblingCount?: number;
  totalCount: number;
  totalPages: number;
}

const props = withDefaults(defineProps<Props>(), {
  class: undefined,
  itemLabel: 'élément',
  itemLabelPlural: undefined,
  ofLabel: 'sur',
  pageSizeOptions: () => [10, 20, 25, 50, 100],
  rowsPerPageLabel: 'Lignes par page',
  siblingCount: 1,
});

const emit = defineEmits<{
  pageChange: [page: number];
  pageSizeChange: [size: number];
}>();

const plural = computed(() => props.itemLabelPlural ?? `${props.itemLabel}s`);

const countText = computed(
  () =>
    `${props.totalCount} ${props.totalCount !== 1 ? plural.value : props.itemLabel}`
);

const pageInfo = computed(
  () =>
    `Page ${props.currentPage} ${props.ofLabel} ${props.totalPages} (${countText.value})`
);

const options = computed(() =>
  Array.from(new Set([props.pageSize, ...props.pageSizeOptions])).sort(
    (a, b) => a - b
  )
);

function onPageChange(page: number) {
  emit('pageChange', page);
}

function onPageSizeChange(value: unknown) {
  if (value != null && value !== '') emit('pageSizeChange', Number(value));
}
</script>

<template>
  <div
    :class="
      cn('flex flex-wrap items-center justify-between gap-4', props.class)
    "
  >
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <Label for="rows-per-page">
          {{ rowsPerPageLabel }}
        </Label>
        <Select
          :model-value="String(pageSize)"
          @update:model-value="onPageSizeChange"
        >
          <SelectTrigger id="rows-per-page" class="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem v-for="n in options" :key="n" :value="String(n)">
                {{ n }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <p class="text-muted-foreground text-sm">
        {{ pageInfo }}
      </p>
    </div>

    <Pagination
      class="mx-0 w-auto"
      :items-per-page="pageSize"
      :page="currentPage"
      :sibling-count="siblingCount"
      :total="totalCount"
      @update:page="onPageChange"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious />
        <template v-for="(item, i) in items" :key="i">
          <PaginationItem
            v-if="item.type === 'page'"
            :is-active="item.value === currentPage"
            :value="item.value"
          >
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis v-else :index="i" />
        </template>
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  </div>
</template>
