<template>
  <div class="flex items-center justify-center min-h-screen p-5 bg-white">
    <ShowArticle v-if="article !== null" :article="article" />
    <div>{{ showArticleError }}</div>

    <PrimeToast position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { H3Error } from "h3";
const route = useRoute("articles-slug");

const slug: ComputedRef<string> = computed(() => route.params.slug);

const {
  data: article,
  error: showArticleRawError,
}: {
  data: Ref<ShowArticleData["article"] | null>;
  error: Ref<H3Error<ShowArticleError> | null>;
} = await useFetch(() => `/api/articles/${slug.value}`, {
  transform: (value) => {
    return value !== null && value !== undefined
      ? ShowArticleDataSchema.parse(value).article
      : null;
  },
});

/**
 ! DANGER
 article can be null
 so that's why we don't render ShowArticle
 component if article is null
*/
provide(ShowArticleToken, {
  article,
} as ShowArticleDI);

const { user: authUser } = useAuthUser();

provide(AuthUserToken, {
  user: authUser,
});

const showArticleError: ComputedRef<ShowArticleError | null> = computed(() => {
  let result: ShowArticleError | null = null;

  if (
    showArticleRawError.value !== null &&
    showArticleRawError.value.data !== undefined
  ) {
    result = showArticleRawError.value.data;
  }

  return result;
});

const onViewCreated = (view: ViewFull) => {
  if (article.value !== null) {
    article.value._count.views++;

    article.value._auth.view = {
      id: view.id,
      articleId: view.articleId,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
      userId: view.userId,
    };
  }
};

const onViewUpdated = (view: ViewFull) => {
  if (article.value !== null) {
    article.value._auth.view = {
      id: view.id,
      articleId: view.articleId,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
      userId: view.userId,
    };
  }
};

useWatchArticleView({
  articleId: () => article.value?.id ?? "",
  onViewCreated,
  onViewUpdated,
  view: () => (article.value !== null ? article.value._auth.view : null),
});
</script>
