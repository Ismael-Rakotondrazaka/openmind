<template>
  <div class="mx-auto w-full max-w-[700px]">
    <ShowArticle v-if="article !== null" :article="article" />
    <NotFoundPage v-else />

    <PrimeConfirmDialog v-if="article !== null" group="dialog:danger">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center rounded-md bg-[--surface-0] p-5">
          <div
            class="-mt-16 inline-flex h-[6rem] w-[6rem] items-center justify-center rounded-full bg-danger text-white"
          >
            <i class="pi pi-question text-5xl"></i>
          </div>
          <span class="mb-2 mt-4 block text-2xl font-bold">{{
            message.header
          }}</span>

          <p class="mb-0 whitespace-pre-wrap">{{ message.message }}</p>

          <div class="mt-4 flex items-center gap-2">
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
const route = useRoute("users-username-articles-slug");

const slug: ComputedRef<string> = computed(() => route.params.slug);

const { article } = useShowArticle({
  param: () => ({
    slug: slug.value,
  }),
  immediate: true,
});

defineOgImageComponent("ArticleOgImage", {
  article: () => article.value,
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
