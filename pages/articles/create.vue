<template>
  <div class="flex items-center justify-center min-h-screen p-5 bg-white">
    <CreateArticleForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: authConfig.AUTHENTICATED_PATH,
  },
});
</script>
