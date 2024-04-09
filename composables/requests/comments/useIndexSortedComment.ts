import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";
import { useSortedComments } from "./useSortedComments";

export const useIndexSortedComment = (payload: {
  where: MaybeRefOrGetter<IndexCommentQuery["where"]>;
  immediate?: boolean;
  pageSize: number;
  parent: MaybeRefOrGetter<CommentFull | null>;
}) => {
  const page = ref(0);

  const formattedQuery = computed<IndexCommentQuery>(() => {
    return {
      where: toValue(payload.where),
      orderBy: {
        createdAt: "desc",
      },
      page: page.value,
      pageSize: payload.pageSize,
    };
  });

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<IndexCommentData | null>;
    error: Ref<FetchError<IndexCommentError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch("/api/comments", {
    method: "GET",
    immediate: payload.immediate,
    watch: false,
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
  const { comments, add, addMany, remove, reset, update, idsSet } =
    useSortedComments({
      parent: payload.parent,
    });

  if (payload.immediate && data.value !== null) {
    addMany(data.value.comments);
  }

  const addNewlyComments = () => {
    if (data.value !== null) {
      addMany(data.value.comments);
    }
  };

  const loadPrevious = async () => {
    page.value += 1;
    await execute();
    addNewlyComments();
    if (data.value !== null && data.value.totalPages < page.value) {
      page.value = data.value.totalPages;
    }
  };

  const _reset = async () => {
    data.value = null;
    error.value = null;

    reset();

    if (payload.immediate === true) {
      await loadPrevious();
    }
  };
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  onServerPrefetch(async () => {
    if (payload.immediate === true) {
      await loadPrevious();
    }
  });

  return {
    comments,
    idsSet,
    error: formattedError,
    loadPrevious,
    add,
    addMany,
    remove,
    update,
    reset: _reset,
  };
};
