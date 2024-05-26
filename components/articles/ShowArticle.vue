<template>
  <div class="w-full">
    <main class="w-full antialiased">
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
import { WSCommentToken } from "~/di";

const { article } = inject(ShowArticleToken) as ShowArticleDI;

const isArticleReactionSidebar = ref<boolean>(false);

provide(ArticleReactionSidebarToken, {
  isVisible: isArticleReactionSidebar,
});

const isCommentDialogVisible = ref<boolean>(false);

provide(ArticleCommentDialogToken, {
  isVisible: isCommentDialogVisible,
});

const runtimeConfig = useRuntimeConfig();

const useWSReturn = useWebSocket(
  () =>
    `${runtimeConfig.public.WSEntryPoint}/comments?articleId=${article.value.id}`,
  {
    heartbeat: {
      interval: WSConfig.BEAT_INTERVAL,
      pongTimeout: WSConfig.BEAT_TIMEOUT,
      message: WSConfig.PING_DEFAULT_VALUE,
    },
    autoReconnect: true,
  },
);

provide(WSCommentToken, useWSReturn);
</script>
