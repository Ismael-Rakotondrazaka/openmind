<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
  <div class="flex items-start gap-3 rounded-lg p-3">
    <Skeleton class="size-9 shrink-0 rounded-full" />
    <div class="flex flex-1 flex-col gap-2">
      <Skeleton class="h-4 w-3/4" />
      <Skeleton class="h-3 w-1/4" />
    </div>
  </div>
</template>
