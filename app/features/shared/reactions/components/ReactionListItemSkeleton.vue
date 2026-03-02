<template>
  <div class="flex items-center gap-3">
    <div class="relative">
      <Skeleton class="size-10 shrink-0 rounded-full" />
      <Skeleton class="absolute -right-1 -bottom-1 size-4 rounded-full" />
    </div>
    <Skeleton class="h-4 w-32" />
  </div>
</template>

<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>
