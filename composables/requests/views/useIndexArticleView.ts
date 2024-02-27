import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useIndexArticleView = (payload: {
  query: MaybeRefOrGetter<IndexViewQuery>;
  immediate?: boolean;
}) => {
  const formattedQuery = computed(() => toValue(payload.query));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<IndexViewData | null>;
    error: Ref<FetchError<IndexReactionError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch("/api/views", {
    method: "GET",
    immediate: true,
    watch: [formattedQuery],
    query: formattedQuery,
    transform: (data): IndexViewData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return IndexViewDataSchema.parse(data);
      }
    },
  });

  /* ---------------------------------- Views --------------------------------- */
  const views = ref<ViewFull[] | null>(data.value?.views ?? null);

  const onUpdateViewsEffect = () => {
    if (data.value === null) {
      views.value = null;
    } else {
      views.value = data.value.views;
    }
  };

  watchEffect(onUpdateViewsEffect);
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

      onUpdateViewsEffect();
      onUpdatePaginationEffect();
    }
  });

  return {
    views,
    pagination,
    error: formattedError,
    execute,
  };
};
