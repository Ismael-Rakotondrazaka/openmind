<script setup lang="ts">
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  compact: false,
});
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <Label v-if="!compact" for="rows-per-page">Rows per page</Label>
        <Select disabled :model-value="'20'">
          <SelectTrigger id="rows-per-page" class="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="20"> 20 </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Skeleton v-if="!compact" class="h-4 w-48" />
    </div>

    <div class="mx-0 w-auto">
      <div class="flex flex-row items-center gap-1">
        <span class="inline-flex">
          <Skeleton class="h-10 w-20" />
        </span>
        <span class="inline-flex">
          <Skeleton class="h-10 w-10" />
        </span>
        <span class="inline-flex">
          <Skeleton class="h-10 w-10" />
        </span>
        <span class="inline-flex">
          <Skeleton class="h-10 w-20" />
        </span>
      </div>
    </div>
  </div>
</template>
