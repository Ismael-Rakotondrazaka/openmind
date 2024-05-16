<template>
  <CreateArticleForm class="mx-auto w-full max-w-[700px]" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
