<script setup lang="ts">
import 'vue-sonner/style.css';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

import { Toaster } from '@/components/ui/sonner';
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster />
    <VueQueryDevtools />
  </NuxtLayout>
</template>
