<template>
  <ul v-auto-animate class="">
    <ArticleListItem
      v-for="article in articles"
      :key="article.id"
      :article="article"
      class="mb-11 w-full"
    />
  </ul>
</template>

<script lang="ts" setup>
type ArticleListProps = {
  articles: ArticleFull[];
};

defineProps<ArticleListProps>();
</script>
