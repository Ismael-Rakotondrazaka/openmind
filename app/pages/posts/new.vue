<script lang="ts" setup>
import CreatePostPage from '~/features/shared/posts/pages/CreatePostPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh py-2">
    <CreatePostPage />
  </div>
</template>

<style scoped></style>
