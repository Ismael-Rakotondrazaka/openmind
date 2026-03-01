<script lang="ts"></script>

<script setup lang="ts">
import LoginPage from '@/features/auth/pages/LoginPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh">
    <LoginPage />
  </div>
</template>
