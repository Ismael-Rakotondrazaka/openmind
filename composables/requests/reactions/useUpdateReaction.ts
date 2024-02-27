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
    transform: (data): UpdateReactionData["reaction"] | null => {
      if (data !== null && data !== undefined) {
        const reactionFull: ReactionFull =
          StoreReactionDataSchema.parse(data).reaction;

        return reactionFull;
      } else {
        return null;
      }
    },
  });

  /* -------------------------------- Reaction -------------------------------- */
  const reaction = ref<Reaction | null>(null);

  const onUpdateReactionEffect = () => {
    if (data.value === null) {
      reaction.value = null;
    } else {
      reaction.value = filterReaction(data.value);
    }
  };

  watchEffect(onUpdateReactionEffect);
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  return {
    reaction,
    reactionFull: data,
    error: formattedError,
    execute,
  };
};
