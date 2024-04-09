<template>
  <li>
    <div class="md:flex rounded-xl dark:bg-slate-800">
      <NuxtLink
        :to="{
          name: 'users-username-articles-slug',
          params: {
            username: article.user.username,
            slug: article.slug,
          },
        }"
        class="w-60 max-h-[12rem], block shrink-0 bg-[--surface-200]"
      >
        <NuxtImg
          v-if="article.coverUrl !== null"
          :src="article.coverUrl"
          class="object-cover h-full w-60"
          width="240"
          height="192"
        />

        <div v-else class="object-cover h-full w-60" width="240" height="192" />
      </NuxtLink>

      <div class="w-full p-3 text-left">
        <div class="flex items-center justify-start mb-2">
          <PrimeAvatar
            v-if="article.user.profileUrl !== null"
            :image="article.user.profileUrl"
            class="mr-2"
            shape="circle"
          />
          <PrimeAvatar v-else icon="pi pi-user" class="mr-2" shape="circle" />
          <div class="text-sm">
            {{ article.user.firstName }}&nbsp;{{ article.user.name }}
          </div>
        </div>

        <h2 class="text-xl font-bold text-slate-900 line-clamp-2">
          <NuxtLink
            :to="{
              name: 'users-username-articles-slug',
              params: {
                username: article.user.username,
                slug: article.slug,
              },
            }"
            >{{ article.title }}</NuxtLink
          >
        </h2>

        <p class="mb-2 text-text text-ellipsis line-clamp-2">
          {{ article.summary ?? "&nbsp;" }}
        </p>

        <p class="inline text-sm text-text">
          {{ formattedPublishDate }}
        </p>
        <span class="inline-block mx-2 text-text">•</span>

        <TagList class="inline" :tags="article.tags" />
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
type ArticleListItemProps = {
  article: ArticleFull;
};

const props = defineProps<ArticleListItemProps>();

const formattedPublishDate = useTimeAgo(() => props.article.createdAt);
</script>
