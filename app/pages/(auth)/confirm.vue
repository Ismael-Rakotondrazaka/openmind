<script lang="ts"></script>

<script setup lang="ts">
import ConfirmPage from '@/features/auth/pages/ConfirmPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh py-2">
    <ConfirmPage />
  </div>
</template>
