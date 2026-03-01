<template>
  <Card>
    <CardHeader>
      <Skeleton class="h-6 w-36" />
      <Skeleton class="h-4 w-64" />
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- New password -->
      <div class="space-y-1.5">
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-9 w-full rounded-md" />
      </div>

      <!-- Confirm password -->
      <div class="space-y-1.5">
        <Skeleton class="h-4 w-32" />
        <Skeleton class="h-9 w-full rounded-md" />
      </div>

      <!-- Button -->
      <Skeleton class="h-9 w-32 rounded-md" />
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
</script>
