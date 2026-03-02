<template>
  <Card>
    <CardHeader>
      <Skeleton class="h-6 w-20" />
      <Skeleton class="h-4 w-72" />
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Avatar -->
      <Skeleton class="size-20 rounded-full" />

      <!-- First name + Last name -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-1.5">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="h-9 w-full rounded-md" />
        </div>
        <div class="space-y-1.5">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="h-9 w-full rounded-md" />
        </div>
      </div>

      <!-- Username -->
      <div class="space-y-1.5">
        <Skeleton class="h-4 w-20" />
        <Skeleton class="h-9 w-full rounded-md" />
      </div>

      <!-- Tags -->
      <div class="space-y-1.5">
        <Skeleton class="h-4 w-28" />
        <Skeleton class="h-10 w-full rounded-md" />
      </div>

      <!-- Button -->
      <Skeleton class="h-9 w-28 rounded-md" />
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
</script>
