<script lang="ts" setup>
import FeedPage from '~/features/shared/posts/pages/FeedPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh">
    <FeedPage />
  </div>
</template>

<style></style>
