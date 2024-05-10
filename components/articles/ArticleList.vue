<template>
  <ul class="flex flex-wrap items-stretch w-full">
    <ArticleListItem
      v-for="article in articles"
      :key="article.id"
      :article="article"
      class="w-full mb-11"
    />
  </ul>
</template>

<script lang="ts" setup>
type ArticleListProps = {
  articles: ArticleFull[];
};

defineProps<ArticleListProps>();
</script>
