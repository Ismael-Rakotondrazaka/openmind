<template>
  <Card>
    <CardHeader>
      <Skeleton class="h-6 w-52" />
      <Skeleton class="h-4 w-64" />
    </CardHeader>
    <CardContent>
      <div class="divide-y">
        <!-- 3 group rows -->
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center justify-between py-4 first:pt-0 last:pb-0"
        >
          <div class="space-y-1.5">
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-3 w-56" />
          </div>
          <Skeleton class="h-5 w-8 rounded-full" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
</script>
