<template>
  <div class="w-full max-w-screen-xl,">
    <main
      class="max-w-2xl pt-8 pb-16 mx-auto antialiased lg:pt-16 lg:pb-24 dark:bg-gray-900"
    >
      <article class="w-full">
        <ArticleHeader />

        <ArticleContentDisplayer :content="article.content" class="mb-5" />

        <ArticleInfoBar />
      </article>
    </main>

    <CommentDialog v-model:is-visible="isCommentDialogVisible" />

    <ReactionSideBar
      v-model:is-visible="isArticleReactionSidebar"
      :article-id="article.id"
      :comment-id="null"
    />
  </div>
</template>

<script lang="ts" setup>
const { article } = inject(ShowArticleToken) as ShowArticleDI;

const isArticleReactionSidebar = ref<boolean>(false);

provide(ArticleReactionSidebarToken, {
  isVisible: isArticleReactionSidebar,
});

const isCommentDialogVisible = ref<boolean>(false);

provide(ArticleCommentDialogToken, {
  isVisible: isCommentDialogVisible,
});
</script>
