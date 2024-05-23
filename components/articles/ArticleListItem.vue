<template>
  <li>
    <address class="mb-3 flex items-center not-italic">
      <div
        class="mr-3 inline-flex items-center text-sm text-gray-900 dark:text-white"
      >
        <PrimeAvatar
          v-if="article.user.profileUrl !== null"
          class="mr-3"
          size="normal"
          shape="circle"
          :image="article.user.profileUrl"
          :alt="`${article.user.firstName} ${article.user.name}`"
        />
        <PrimeAvatar
          v-else
          icon="pi pi-user"
          class="mr-3"
          size="normal"
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
            class="inline-block font-bold text-text hover:text-primary hover:underline"
          >
            {{ `${article.user.firstName} ${article.user.name}` }}
          </NuxtLink>

          <ArticlePublishDateDisplayer
            :date="article.createdAt"
            class="!text-xs"
          />
        </div>
      </div>
    </address>
    <h1 class="mb-3 line-clamp-2 text-lg font-bold text-slate-900 md:text-xl">
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
    </h1>

    <p
      v-if="article.summary !== null"
      class="mb-2 line-clamp-2 text-ellipsis text-text"
    >
      {{ article.summary }}
    </p>

    <TagList :tags="article.tags" class="mb-3" />

    <figure v-if="article.coverUrl !== null" class="mb-3">
      <NuxtLink
        :to="{
          name: 'users-username-articles-slug',
          params: {
            username: article.user.username,
            slug: article.slug,
          },
        }"
      >
        <img
          :src="article.coverUrl"
          class="aspect-video w-full rounded-md object-cover object-center"
          alt=""
        />
      </NuxtLink>
    </figure>

    <div class="fle-row flex items-center justify-start gap-3 border-y py-1">
      <PrimeButton
        icon="pi pi-thumbs-up"
        severity="secondary"
        :label="formattedReactionCount"
        text
        class="inline-block"
      />

      <PrimeButton
        icon="pi pi-comment"
        severity="secondary"
        :label="formattedCommentCount"
        text
        class="inline-block"
      />

      <PrimeButton
        icon="pi pi-eye"
        severity="secondary"
        :label="formattedViewCount"
        text
        class="inline-block"
      />
    </div>
  </li>
</template>

<script lang="ts" setup>
type ArticleListItemProps = {
  article: ArticleFull;
};

const props = defineProps<ArticleListItemProps>();

const formattedReactionCount = useNumericAbbreviation(
  () => props.article._count.reactions,
);
const formattedViewCount = useNumericAbbreviation(
  () => props.article._count.views,
);
const formattedCommentCount = useNumericAbbreviation(
  () => props.article._count.comments,
);
</script>
