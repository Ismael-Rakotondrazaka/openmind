import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useIndexReaction = (payload: {
  query: MaybeRefOrGetter<IndexReactionQuery>;
  immediate?: boolean;
}) => {
  const formattedQuery = computed(() => toValue(payload.query));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<IndexReactionData | null>;
    error: Ref<FetchError<IndexReactionError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch("/api/reactions", {
    method: "GET",
    immediate: true,
    watch: [formattedQuery],
    query: formattedQuery,
    transform: (data): IndexReactionData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return IndexReactionDataSchema.parse(data);
      }
    },
  });

  /* -------------------------------- Reactions ------------------------------- */
  const reactions = ref<ReactionFull[] | null>(data.value?.reactions ?? null);

  const onUpdateReactionsEffect = () => {
    if (data.value === null) {
      reactions.value = null;
    } else {
      reactions.value = data.value.reactions;
    }
  };

  watchEffect(onUpdateReactionsEffect);
  /* -------------------------------------------------------------------------- */

  /* ------------------------------- Pagination ------------------------------- */
  const pagination = ref<Pagination | null>(null);

  const onUpdatePaginationEffect = () => {
    if (data.value === null) {
      pagination.value = null;
    } else {
      pagination.value = filterPagination(data.value);
    }
  };

  watchEffect(onUpdatePaginationEffect);
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  onServerPrefetch(async () => {
    if (payload.immediate === true) {
      await execute();

      onUpdateReactionsEffect();
      onUpdatePaginationEffect();
    }
  });

  return {
    reactions,
    pagination,
    error: formattedError,
    execute,
  };
};
