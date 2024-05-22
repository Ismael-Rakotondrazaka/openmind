<template>
  <CreateArticleForm class="mx-auto w-full max-w-[700px]" />
</template>

<script setup lang="ts">
defineOgImageComponent("DefaultOgImage");

definePageMeta({
  middleware: "auth",
});
</script>
