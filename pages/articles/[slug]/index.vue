<template>
  <div
    class="flex items-center justify-center min-h-screen p-5 bg-white text-text"
  >
    <ShowArticle v-if="article !== null" :article="article" />
    <div>{{ showArticleError }}</div>

    <PrimeToast position="top-right" />

    <PrimeConfirmDialog group="dialog:danger">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-5 bg-[--surface-0] rounded-md">
          <div
            class="rounded-full text-white bg-danger inline-flex justify-center items-center h-[6rem] w-[6rem] -mt-16"
          >
            <i class="text-5xl pi pi-question"></i>
          </div>
          <span class="block mt-4 mb-2 text-2xl font-bold">{{
            message.header
          }}</span>

          <p class="mb-0 whitespace-pre-wrap">{{ message.message }}</p>

          <div class="flex items-center gap-2 mt-4">
            <PrimeButton
              label="Yes, Delete"
              severity="danger"
              @click="acceptCallback"
            ></PrimeButton>
            <PrimeButton
              label="Cancel"
              outlined
              severity="secondary"
              @click="rejectCallback"
            ></PrimeButton>
          </div>
        </div>
      </template>
    </PrimeConfirmDialog>
  </div>
</template>

<script setup lang="ts">
const route = useRoute("articles-slug");

const slug: ComputedRef<string> = computed(() => route.params.slug);

const { article, error: showArticleError } = useShowArticle({
  param: () => ({
    slug: slug.value,
  }),
  immediate: true,
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
