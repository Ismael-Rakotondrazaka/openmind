<script lang="ts" setup>
import AuthUserProfilePage from '~/features/users/pages/AuthUserProfilePage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh py-2">
    <AuthUserProfilePage />
  </div>
</template>

<style></style>
