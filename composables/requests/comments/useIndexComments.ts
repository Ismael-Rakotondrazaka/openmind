import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useIndexComment = (payload: {
  query: MaybeRefOrGetter<IndexCommentQuery>;
  immediate?: boolean;
}) => {
  const formattedQuery = computed(() => toValue(payload.query));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<IndexCommentData | null>;
    error: Ref<FetchError<IndexCommentError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
  } = useFetch("/api/comments", {
    method: "GET",
    immediate: payload.immediate,
    watch: [formattedQuery],
    query: formattedQuery,
    transform: (data): IndexCommentData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return IndexCommentDataSchema.parse(data);
      }
    },
  });

  /* -------------------------------- Comments ------------------------------- */
  const comments = ref<CommentFull[] | null>(data.value?.comments ?? null);

  const onUpdateCommentsEffect = () => {
    if (data.value === null) {
      comments.value = null;
    } else {
      comments.value = data.value.comments;
    }
  };

  watchEffect(onUpdateCommentsEffect);
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

      onUpdateCommentsEffect();
      onUpdatePaginationEffect();
    }
  });

  return {
    comments,
    pagination,
    error: formattedError,
    execute,
  };
};
