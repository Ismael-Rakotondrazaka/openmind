<script lang="ts" setup>
import SettingsPage from '~/features/users/pages/SettingsPage.vue';

definePageMeta({
  middleware: 'auth',
});

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh py-2">
    <SettingsPage />
  </div>
</template>
