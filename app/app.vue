<script setup lang="ts">
import 'vue-sonner/style.css';

import { Toaster } from '@/components/ui/sonner';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster />
  </NuxtLayout>
</template>
