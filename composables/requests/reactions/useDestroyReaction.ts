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
    execute,
    error: formattedError,
  };
};
