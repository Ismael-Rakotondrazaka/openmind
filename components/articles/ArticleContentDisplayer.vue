<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="ql-editor" v-html="content"></div>
</template>

<script lang="ts" setup>
interface ArticleContentFormatterProps {
  content: string;
}

defineProps<ArticleContentFormatterProps>();
</script>
