<template>
  <div class="w-full max-w-screen-xl">
    <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 dark:bg-gray-900 antialiased">
      <div class="flex justify-between px-4">
        <article
          class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert"
        >
          <ArticleHeader />

          <ArticleContentDisplayer :content="article.content" class="mb-5" />

          <ArticleInfoBar />
        </article>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
const { article } = inject(ShowArticleToken) as ShowArticleDI;
</script>
