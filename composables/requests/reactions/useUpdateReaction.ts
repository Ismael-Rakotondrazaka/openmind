import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useUpdateReaction = (payload: {
  reactionId: MaybeRefOrGetter<number>;
  body: MaybeRefOrGetter<UpdateReactionBody>;
}) => {
  const url = computed(() => `/api/reactions/${toValue(payload.reactionId)}`);

  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<UpdateReactionData["reaction"] | null>;
    error: Ref<FetchError<UpdateReactionError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch(url, {
    method: "PUT",
    body: formattedBody,
    immediate: false,
    watch: false,
    transform: (data): UpdateReactionData["reaction"] | null | null => {
      if (data !== null && data !== undefined) {
        const reactionFull: ReactionFull =
          StoreReactionDataSchema.parse(data).reaction;

        return reactionFull;
      } else {
        return null;
      }
    },
  });

  const formattedError = computed<UpdateReactionError | null>(() => {
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
