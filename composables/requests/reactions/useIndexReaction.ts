import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useIndexReaction = (payload: {
  query: MaybeRefOrGetter<IndexReactionQuery>;
  immediate?: boolean;
}) => {
  const formattedQuery = computed(() =>
    JSONStringifyNested(toValue(payload.query)),
  );

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

  watchImmediate(
    (): ReactionFull[] | null => {
      if (data.value === null) {
        return null;
      } else {
        return data.value.reactions;
      }
    },
    (newValue) => {
      reactions.value = newValue;
    },
    {
      deep: true,
    },
  );

  /* -------------------------------------------------------------------------- */

  /* ------------------------------- Pagination ------------------------------- */

  const pagination = ref<Pagination | null>(null);

  watchImmediate(
    (): Pagination | null => {
      if (data.value === null) {
        return null;
      } else {
        return {
          count: data.value.count,
          links: data.value.links,
          page: data.value.page,
          pageSize: data.value.pageSize,
          totalCounts: data.value.totalCounts,
          totalPages: data.value.totalPages,
        };
      }
    },
    (newValue) => {
      pagination.value = newValue;
    },
    {
      deep: true,
    },
  );

  const formattedError = useFetchErrorData(error);

  onServerPrefetch(async () => {
    if (payload.immediate === true) {
      await execute();

      reactions.value = data.value?.reactions ?? null;
    }
  });

  return {
    reactions,
    pagination,
    error: formattedError,
    execute,
  };
};
