<template>
  <div class="ql-snow">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="ql-editor w-full text-text" v-html="content"></div>
  </div>
</template>

<script lang="ts" setup>
interface ArticleContentFormatterProps {
  content: string;
}

defineProps<ArticleContentFormatterProps>();
</script>
