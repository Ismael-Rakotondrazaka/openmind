<template>
  <Card>
    <CardHeader>
      <Skeleton class="h-6 w-28" />
      <Skeleton class="h-4 w-44" />
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Email field -->
      <div class="space-y-1.5">
        <Skeleton class="h-4 w-12" />
        <Skeleton class="h-9 w-full rounded-md" />
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
