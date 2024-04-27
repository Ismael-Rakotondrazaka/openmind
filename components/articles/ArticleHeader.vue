<template>
  <header class="mb-5 lg:mb-6">
    <address class="flex items-center justify-between mb-6">
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
              name: 'users-username',
              params: {
                username: article.user.username,
              },
            }"
            class="text-xl font-bold text-text dark:text-white hover:text-[--primary-color] hover:underline"
          >
            {{ `${article.user.firstName} ${article.user.name}` }}
          </NuxtLink>

          <ArticlePublishDateDisplayer :date="article.createdAt" />
        </div>
      </div>

      <ArticleOptionsButton :article="article" />
    </address>
    <h1
      class="mb-4 text-3xl font-extrabold leading-tight text-text lg:mb-6 lg:text-4xl dark:text-white"
    >
      {{ article.title }}
    </h1>

    <p v-if="article.summary !== null" class="text-text mb-3">
      {{ article.summary }}
    </p>

    <TagList :tags="article.tags" class="mb-3" />

    <figure v-if="article.coverUrl !== null" class="mb-3">
      <img
        :src="article.coverUrl"
        class="object-cover object-center w-full rounded-md aspect-video"
        alt=""
      />
    </figure>

    <ArticleInfoBar />
  </header>
</template>

<script lang="ts" setup>
const { article } = inject(ShowArticleToken) as ShowArticleDI;
</script>
