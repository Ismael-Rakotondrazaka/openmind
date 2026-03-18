<script lang="ts"></script>

<script setup lang="ts">
import PasswordUpdatePage from '@/features/auth/pages/PasswordUpdatePage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh py-2">
    <PasswordUpdatePage />
  </div>
</template>
