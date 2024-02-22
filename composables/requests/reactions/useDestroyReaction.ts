import { type FetchError } from "ofetch";
import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";

export const useDestroyReaction = (payload: {
  reactionId: MaybeRefOrGetter<number>;
}) => {
  const url = computed<string>(
    () => `/api/reactions/${toValue(payload.reactionId)}`,
  );

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<DestroyReactionData["reaction"] | null>;
    error: Ref<FetchError<DestroyReactionError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch(url, {
    method: "DELETE",
    immediate: false,
    watch: false,
    transform: (data) => {
      if (data === undefined || data === null) {
        return null;
      } else {
        return DestroyReactionDataSchema.parse(data).reaction;
      }
    },
  });

  const formattedError = computed<DestroyReactionError | null>(() => {
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
    execute,
    error: formattedError,
  };
};
