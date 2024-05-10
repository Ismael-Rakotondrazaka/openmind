<template>
  <li>
    <address class="flex items-center mb-3 not-italic">
      <div
        class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"
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
            class="inline-block text-text font-bold hover:text-primary hover:underline"
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
    <h1 class="text-xl mb-3 font-bold text-slate-900 line-clamp-2">
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
      class="mb-2 text-text text-ellipsis line-clamp-2"
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
          class="object-cover object-center w-full rounded-md aspect-video"
          alt=""
        />
      </NuxtLink>
    </figure>

    <div class="flex items-center gap-3 justify-start py-1 border-y fle-row">
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
