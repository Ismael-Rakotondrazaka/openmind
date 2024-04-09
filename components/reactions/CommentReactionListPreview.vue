<template>
  <button
    v-if="haveReactions"
    class="inline-flex items-center hover:text-[--primary-color] hover:underline hover:underline-[--primary-color] text-sm text-[--text-color-secondary]"
    @click="onToggleArticleReactionSideBar"
  >
    <ArticleReactionTypeListPreview
      :reactions="reactions"
      class="inline-flex mr-1"
    />

    {{ buttonLabel }}
  </button>
</template>

<script setup lang="ts">
const { article } = inject(ShowArticleToken) as ShowArticleDI;

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const { isVisible } = inject(
  ArticleReactionSidebarToken,
) as ArticleReactionSidebarDI;

const authReaction = computed<ReactionFull | null>(() => {
  if (article.value._auth.reaction === null || authUser.value === null) {
    return null;
  } else {
    return {
      ...article.value._auth.reaction,
      user: filterUser(authUser.value),
    };
  }
});

/* eslint-disable indent */
const makeIndexReactionQuery =
  (payload: { reactionType: ReactionType }): (() => IndexReactionQuery) =>
  () => {
    return {
      where: {
        userId: {
          not: authUser.value?.id,
        },
        articleId: article.value.id,
        type: {
          equals: payload.reactionType,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      page: 1,
      pageSize: 1,
    };
  };
/* eslint-enable indent */

const { reactions: likeReactions, execute: refetchLikeReactions } =
  useIndexReaction({
    query: makeIndexReactionQuery({
      reactionType: "like",
    }),
    immediate: true,
  });

const { reactions: loveReactions, execute: refetchLoveReactions } =
  useIndexReaction({
    query: makeIndexReactionQuery({
      reactionType: "love",
    }),
    immediate: true,
  });

const { reactions: celebrateReactions, execute: refetchCelebrateReactions } =
  useIndexReaction({
    query: makeIndexReactionQuery({
      reactionType: "celebrate",
    }),
    immediate: true,
  });

const refetchReactions = () =>
  Promise.allSettled([
    refetchLikeReactions(),
    refetchLoveReactions(),
    refetchCelebrateReactions(),
  ]);

const otherReactionsExtract = computed<ReactionFull[]>(() => {
  const result: ReactionFull[] = [];

  if (likeReactions.value !== null) {
    result.push(...likeReactions.value);
  }

  if (loveReactions.value !== null) {
    result.push(...loveReactions.value);
  }

  if (celebrateReactions.value !== null) {
    result.push(...celebrateReactions.value);
  }

  return result;
});

const reactions = computed<ReactionFull[]>(() => {
  const result: ReactionFull[] = [];

  if (authReaction.value !== null) {
    result.push(authReaction.value);
  }

  result.push(...otherReactionsExtract.value);

  return result;
});

const haveReactions = computed<boolean>(() => reactions.value.length > 0);

const buttonLabel = useReactionPreviewText({
  authReaction,
  otherReactionsExtract,
  count: () => article.value._count.reactions,
});

watch(
  () => article.value._count.reactions,
  async () => {
    await refetchReactions();
  },
);

const onToggleArticleReactionSideBar = () => {
  isVisible.value = !isVisible.value;
};
</script>
