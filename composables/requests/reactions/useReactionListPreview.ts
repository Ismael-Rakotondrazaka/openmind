import type { ReactionType } from "@prisma/client";

export interface IUseReactionListPreviewBaseArg {
  authUserId: MaybeRefOrGetter<number | null>;
  immediate?: boolean;
}

export interface IUseArticleReactionListPreviewArg {
  articleId: MaybeRefOrGetter<null>;
  commentId: MaybeRefOrGetter<string>;
}

export interface IUseCommentReactionListPreviewArg {
  articleId: MaybeRefOrGetter<string>;
  commentId: MaybeRefOrGetter<null>;
}

export type IUseReactionListPreviewArg = IUseReactionListPreviewBaseArg &
  (IUseArticleReactionListPreviewArg | IUseCommentReactionListPreviewArg);

export const useReactionListPreview = (payload: IUseReactionListPreviewArg) => {
  const authUserId = computed(() => toValue(payload.authUserId));
  const articleId = computed(() => toValue(payload.articleId));
  const commentId = computed(() => toValue(payload.commentId));

  const { reactions: authReactionsRaw, execute: refetchAuthReaction } =
    useIndexReaction({
      query: () => ({
        where: {
          userId: authUserId.value ?? undefined,
          articleId: articleId.value,
          commentId: commentId.value,
        },
        orderBy: {
          createdAt: "desc",
        },
        page: 1,
        pageSize: 1,
      }),
      immediate: payload.immediate,
    });

  const authReaction = computed<ReactionFull | null>(() => {
    if (
      authUserId.value !== null &&
      authReactionsRaw.value !== null &&
      authReactionsRaw.value.length > 0
    ) {
      return authReactionsRaw.value[0];
    } else {
      return null;
    }
  });

  const makeIndexReactionQuery =
    (payload: { reactionType: ReactionType }): (() => IndexReactionQuery) =>
    () => {
      return {
        where: {
          userId: {
            not: authUserId.value ?? undefined,
          },
          articleId: articleId.value,
          commentId: commentId.value,
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

  const { reactions: likeReactions, execute: refetchLikeReactions } =
    useIndexReaction({
      query: makeIndexReactionQuery({
        reactionType: "like",
      }),
      immediate: payload.immediate,
    });

  const { reactions: loveReactions, execute: refetchLoveReactions } =
    useIndexReaction({
      query: makeIndexReactionQuery({
        reactionType: "love",
      }),
      immediate: payload.immediate,
    });

  const { reactions: celebrateReactions, execute: refetchCelebrateReactions } =
    useIndexReaction({
      query: makeIndexReactionQuery({
        reactionType: "celebrate",
      }),
      immediate: payload.immediate,
    });

  const execute = async () => {
    await Promise.allSettled([
      refetchAuthReaction(),
      refetchLikeReactions(),
      refetchLoveReactions(),
      refetchCelebrateReactions(),
    ]);
  };

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

  return {
    authReaction,
    reactions,
    otherReactionsExtract,
    execute,
  };
};
