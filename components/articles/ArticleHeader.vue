<template>
  <header class="mb-5 lg:mb-6">
    <address class="mb-6 flex items-center justify-between not-italic">
      <div
        class="mr-3 inline-flex items-center text-sm text-gray-900 dark:text-white"
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
              name: 'users-username',
              params: {
                username: article.user.username,
              },
            }"
            class="text-lg font-bold text-text hover:text-[--primary-color] hover:underline md:text-xl dark:text-white"
          >
            {{ `${article.user.firstName} ${article.user.name}` }}
          </NuxtLink>

          <ArticlePublishDateDisplayer :date="article.createdAt" />
        </div>
      </div>

      <ArticleOptionsButton :article="article" />
    </address>
    <h1
      class="mb-4 text-xl font-extrabold leading-tight text-text md:text-2xl lg:mb-6 lg:text-3xl dark:text-white"
    >
      {{ article.title }}
    </h1>

    <p v-if="article.summary !== null" class="mb-3 text-text">
      {{ article.summary }}
    </p>

    <TagList :tags="article.tags" class="mb-3" />

    <figure v-if="article.coverUrl !== null" class="mb-3">
      <img
        :src="article.coverUrl"
        class="aspect-video w-full rounded-md object-cover object-center"
        alt=""
      />
    </figure>

    <ArticleInfoBar />
  </header>
</template>

<script lang="ts" setup>
const { article } = inject(ShowArticleToken) as ShowArticleDI;
</script>
