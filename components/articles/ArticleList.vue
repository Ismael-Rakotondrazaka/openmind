<template>
  <ul class="flex flex-wrap items-stretch justify-evenly, w-full gap-5">
    <ArticleListItem
      v-for="article in articles"
      :key="article.id"
      :article="article"
      class="w-full"
    />
  </ul>
</template>

<script lang="ts" setup>
type ArticleListProps = {
  articles: ArticleFull[];
};

defineProps<ArticleListProps>();
</script>
