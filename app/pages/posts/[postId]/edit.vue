<script lang="ts" setup>
import EditPostPage from '~/features/shared/posts/pages/EditPostPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});
</script>

<template>
  <div class="min-h-svh">
    <EditPostPage />
  </div>
</template>

<style></style>
