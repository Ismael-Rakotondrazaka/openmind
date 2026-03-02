<template>
  <div class="rounded-lg p-4">
    <!-- Header: avatar + author name + date -->
    <div class="mb-3 flex items-center gap-2">
      <Skeleton class="size-10 rounded-full" />
      <div class="space-y-1.5">
        <Skeleton class="h-4 w-28" />
        <Skeleton class="h-3 w-20" />
      </div>
    </div>

    <!-- Title -->
    <Skeleton class="mb-2 h-6 w-3/4" />

    <!-- Tags -->
    <div class="mb-3 flex gap-1.5">
      <Skeleton class="h-5 w-14 rounded-full" />
      <Skeleton class="h-5 w-16 rounded-full" />
    </div>

    <!-- Content preview lines -->
    <div class="mb-3 space-y-1.5">
      <Skeleton class="h-3.5 w-full" />
      <Skeleton class="h-3.5 w-full" />
      <Skeleton class="h-3.5 w-4/5" />
    </div>

    <!-- Footer: reaction buttons -->
    <div class="flex gap-2">
      <Skeleton class="h-8 w-16 rounded-md" />
      <Skeleton class="h-8 w-16 rounded-md" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>
