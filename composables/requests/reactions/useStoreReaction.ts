import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useStoreReaction = (payload: {
  body: MaybeRefOrGetter<StoreReactionBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<StoreReactionData["reaction"] | null>;
    error: Ref<FetchError<StoreReactionError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch("/api/reactions", {
    method: "POST",
    body: formattedBody,
    immediate: false,
    watch: false,
    transform: (data): StoreReactionData["reaction"] | null | null => {
      if (data !== null && data !== undefined) {
        const reactionFull: ReactionFull =
          StoreReactionDataSchema.parse(data).reaction;

        return reactionFull;
      } else {
        return null;
      }
    },
  });

  const formattedError = computed<StoreReactionError | null>(() => {
    if (error.value === null || error.value.data === undefined) {
      return null;
    } else {
      return error.value.data;
    }
  });

  const reaction = ref<Reaction | null>(null);

  watch(data, (newValue) => {
    if (newValue === null) {
      reaction.value = null;
    } else {
      const formattedReaction: Reaction = {
        articleId: newValue.articleId,
        commentId: newValue.commentId,
        createdAt: newValue.createdAt,
        id: newValue.id,
        type: newValue.type,
        userId: newValue.userId,
      } as Reaction;

      reaction.value = formattedReaction;
    }
  });

  return {
    reaction,
    reactionFull: data,
    error: formattedError,
    execute,
  };
};
