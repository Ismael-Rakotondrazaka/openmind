<script lang="ts"></script>

<script setup lang="ts">
import PasswordResetPage from '@/features/auth/pages/PasswordResetPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh">
    <PasswordResetPage />
  </div>
</template>
