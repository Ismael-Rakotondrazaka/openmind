<script setup lang="ts">
import RegisterPage from '@/features/auth/pages/RegisterPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});

definePageMeta({
  layout: 'default',
});
</script>

<template>
  <div class="min-h-svh py-2">
    <RegisterPage />
  </div>
</template>
