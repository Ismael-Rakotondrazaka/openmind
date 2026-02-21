<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontal,
} from 'lucide-vue-next';
import { computed } from 'vue';

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

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): ('ellipsis' | number)[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];

  const left = Math.max(2, currentPage - siblingCount);
  const right = Math.min(totalPages - 1, currentPage + siblingCount);
  const items: ('ellipsis' | number)[] = [1];

  if (left > 2) items.push('ellipsis');
  for (let p = left; p <= right; p++) items.push(p);
  if (right < totalPages - 1) items.push('ellipsis');
  if (totalPages > 1) items.push(totalPages);

  return items;
}

const range = computed(() =>
  getPaginationRange(props.currentPage, props.totalPages, props.siblingCount)
);

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
        <UiLabel for="rows-per-page">
          {{ rowsPerPageLabel }}
        </UiLabel>
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

    <div class="mx-0 w-auto">
      <nav class="flex flex-row items-center gap-1" aria-label="Pagination">
        <span class="inline-flex">
          <UiButton
            aria-label="Aller à la page précédente"
            class="gap-1 px-2.5 sm:pl-2.5"
            :disabled="currentPage <= 1"
            size="default"
            variant="ghost"
            @click="onPageChange(currentPage - 1)"
          >
            <ChevronLeftIcon />
            <span class="hidden sm:inline">Précédent</span>
          </UiButton>
        </span>

        <template
          v-for="(item, i) in range"
          :key="item === 'ellipsis' ? `ellipsis-${i}` : item"
        >
          <span v-if="item === 'ellipsis'" class="inline-flex">
            <span class="flex size-9 items-center justify-center" aria-hidden>
              <MoreHorizontal class="size-4" />
            </span>
          </span>
          <span v-else class="inline-flex">
            <UiButton
              :aria-current="currentPage === item ? 'page' : undefined"
              size="icon"
              :variant="currentPage === item ? 'outline' : 'ghost'"
              @click="onPageChange(item)"
            >
              {{ item }}
            </UiButton>
          </span>
        </template>

        <span class="inline-flex">
          <UiButton
            aria-label="Aller à la page suivante"
            class="gap-1 px-2.5 sm:pr-2.5"
            :disabled="currentPage >= totalPages"
            size="default"
            variant="ghost"
            @click="onPageChange(currentPage + 1)"
          >
            <span class="hidden sm:inline">Suivant</span>
            <ChevronRightIcon />
          </UiButton>
        </span>
      </nav>
    </div>
  </div>
</template>
