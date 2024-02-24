<template>
  <div class="w-full max-w-screen-xl">
    <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 dark:bg-gray-900 antialiased">
      <div class="flex justify-between px-4">
        <article
          class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert"
        >
          <header class="mb-5 lg:mb-6 not-format">
            <address class="flex items-center mb-6 not-italic">
              <div
                class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"
              >
                <PrimeAvatar
                  v-if="article.user.profileUrl !== null"
                  class="mr-3"
                  size="xlarge"
                  shape="circle"
                  :image="article.user.profileUrl"
                  :alt="`${article.user.firstName} ${article.user.name}`"
                />
                <PrimeAvatar
                  v-else
                  icon="pi pi-user"
                  class="mr-3"
                  size="xlarge"
                  shape="circle"
                  :alt="`${article.user.firstName} ${article.user.firstName}`"
                />
                <div>
                  <NuxtLink
                    :to="{
                      name: 'articles',
                    }"
                    class="text-xl font-bold text-[--text-color] dark:text-white hover:text-[--primary-color] hover:underline"
                  >
                    {{ `${article.user.firstName} ${article.user.name}` }}
                  </NuxtLink>

                  <ArticlePublishDateDisplayer :date="article.createdAt" />
                </div>
              </div>
            </address>
            <h1
              class="mb-4 text-3xl font-extrabold leading-tight text-[--text-color] lg:mb-6 lg:text-4xl dark:text-white"
            >
              {{ article.title }}
            </h1>

            <p v-if="article.summary !== null" class="text-[--text-color] mb-3">
              {{ article.summary }}
            </p>

            <figure v-if="article.coverUrl !== null" class="mb-3">
              <img
                :src="article.coverUrl"
                class="object-cover w-full aspect-video rounded-md object-center"
                alt=""
              />
            </figure>

            <ArticleInfoBar
              v-model:reaction="reaction"
              v-model:reactions-count="reactionsCount"
              v-model:comments-count="commentsCount"
              v-model:views-count="viewsCount"
              v-model:saved-article="savedArticle"
              :article-id="article.id"
            />
          </header>

          <ArticleContentDisplayer :content="article.content" class="mb-5" />

          <ArticleInfoBar
            v-model:reaction="reaction"
            v-model:reactions-count="reactionsCount"
            v-model:comments-count="commentsCount"
            v-model:views-count="viewsCount"
            v-model:saved-article="savedArticle"
            :article-id="article.id"
          />
        </article>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
interface ShowArticleProps {
  article: ArticleFull;
}

const props = defineProps<ShowArticleProps>();

const reaction = ref<Reaction | null>(props.article._auth.reaction);
const reactionsCount = ref<number>(props.article._count.reactions);
const commentsCount = ref<number>(props.article._count.comments);
const viewsCount = ref<number>(props.article._count.views);
const savedArticle = ref<SavedArticle | null>(props.article._auth.savedArticle);

watchDeep(
  () => props.article,
  (newValue) => {
    reaction.value = newValue._auth.reaction;
    reactionsCount.value = newValue._count.reactions;
    commentsCount.value = newValue._count.comments;
    viewsCount.value = newValue._count.views;

    savedArticle.value = newValue._auth.savedArticle;
  },
);
</script>
