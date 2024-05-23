<template>
  <div>
    <ArticleReactionListPreview class="mb-3" />

    <div class="flex flex-row items-center justify-between gap-3 border-y py-1">
      <div class="flex items-center justify-start gap-0 md:gap-3">
        <ReactionButton
          v-model:count="reactionsCount"
          v-model:reaction="reaction"
          :article-id="article.id"
          :comment-id="null"
          class="inline-block"
        />

        <CommentButton
          v-model:count="commentsCount"
          class=""
          @comments:show="onArticleCommentShowHandler"
        />

        <ViewsCountDisplayer :count="viewsCount" />
      </div>

      <div class="flex items-start justify-end gap-0 md:gap-3">
        <SaveArticleButton
          v-if="authUser !== null"
          v-model:saved-article="savedArticle"
          :article-id="article.id"
        />

        <ShareArticleButton :url="articleUrl" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type SavedArticle } from "@prisma/client";
const { article } = inject(ShowArticleToken) as ShowArticleDI;

const { user: authUser } = useAuthUser();

const reaction = ref<Reaction | null>(article.value._auth.reaction);
watchDeep(reaction, (newValue) => {
  article.value._auth.reaction = newValue;
});
watchDeep(
  () => article.value._auth.reaction,
  (newValue) => {
    reaction.value = newValue;
  },
);

const reactionsCount = ref<number>(article.value._count.reactions);
watchDeep(reactionsCount, (newValue) => {
  if (article.value._count.reactions !== newValue) {
    article.value._count.reactions = newValue;
  }
});
watchDeep(
  () => article.value._count.reactions,
  (newValue) => {
    if (reactionsCount.value !== newValue) {
      reactionsCount.value = newValue;
    }
  },
);

const savedArticle = ref<SavedArticle | null>(article.value._auth.savedArticle);
watchDeep(savedArticle, (newValue) => {
  if (article.value._auth.savedArticle !== newValue) {
    article.value._auth.savedArticle = newValue;
  }
});
watchDeep(
  () => article.value._auth.savedArticle,
  (newValue) => {
    if (savedArticle.value !== newValue) {
      savedArticle.value = newValue;
    }
  },
);

const commentsCount = ref<number>(article.value._count.comments);
watchDeep(commentsCount, (newValue) => {
  if (article.value._count.comments !== newValue) {
    article.value._count.comments = newValue;
  }
});
watchDeep(
  () => article.value._count.comments,
  (newValue) => {
    if (commentsCount.value !== newValue) {
      commentsCount.value = newValue;
    }
  },
);

const viewsCount = ref<number>(article.value._count.views);
watchDeep(viewsCount, (newValue) => {
  if (article.value._count.views !== newValue) {
    article.value._count.views = newValue;
  }
});
watchDeep(
  () => article.value._count.views,
  (newValue) => {
    if (viewsCount.value !== newValue) {
      viewsCount.value = newValue;
    }
  },
);

const runtimeConfig = useRuntimeConfig();

const route = useRoute("users-username-articles-slug");

const articleUrl = computed<string>(
  () => `${runtimeConfig.public.appUrl}${route.path}`,
);
const { isVisible } = inject(
  ArticleCommentDialogToken,
) as ArticleCommentDialogDI;

const onArticleCommentShowHandler = () => {
  isVisible.value = true;
};
</script>
