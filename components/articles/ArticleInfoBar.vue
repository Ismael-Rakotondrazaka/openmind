<template>
  <div class="flex py-1 border-y fle-row items-center justify-between">
    <div>
      <ReactionButton
        v-model:count="reactionsCount"
        v-model:reaction="reaction"
        :article-id="articleId"
        class="mr-3 inline-block"
      />

      <CommentButton v-model:count="commentsCount" class="mr-3" />

      <ViewsCountDisplayer :count="viewsCount" />
    </div>

    <div class="">
      <SaveArticleButton
        v-model:saved-article="savedArticle"
        :article-id="articleId"
      />

      <ShareArticleButton :url="articleUrl" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface ArticleInfoBarProps {
  articleId: string;
}

defineProps<ArticleInfoBarProps>();

const reaction = defineModel<Reaction | null>("reaction", {
  required: true,
});

const savedArticle = defineModel<SavedArticle | null>("savedArticle", {
  required: true,
});

const reactionsCount = defineModel<number>("reactionsCount", {
  required: true,
});

const commentsCount = defineModel<number>("commentsCount", {
  required: true,
});

const viewsCount = defineModel<number>("viewsCount", {
  required: true,
});

const runtimeConfig = useRuntimeConfig();

const route = useRoute("articles-slug");

const articleUrl = computed<string>(
  () => `${runtimeConfig.public.appUrl}${route.path}`,
);
</script>
