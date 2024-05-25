import type { AsyncData } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useIndexSavedArticle = (payload: {
  query: MaybeRefOrGetter<IndexSavedArticleQuery>;
  immediate?: boolean;
}) => {
  const formattedQuery = computed(() => toValue(payload.query));

  const {
    data,
    execute,
    error,
  }: AsyncData<
    IndexSavedArticleData | null,
    FetchError<IndexSavedArticleError> | null
  > = useFetch("/api/saved-articles", {
    method: "GET",
    immediate: payload.immediate,
    watch: [formattedQuery],
    query: formattedQuery,
    transform: (data): IndexSavedArticleData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return IndexSavedArticleDataSchema.parse(data);
      }
    },
  });

  /* -------------------------------- Articles ------------------------------- */
  const savedArticles = ref<SavedArticleFull[] | null>(
    data.value?.savedArticles ?? null,
  );

  const onUpdateArticlesEffect = () => {
    if (data.value === null) {
      savedArticles.value = null;
    } else {
      savedArticles.value = data.value.savedArticles;
    }
  };

  watchEffect(onUpdateArticlesEffect);
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

      onUpdateArticlesEffect();
      onUpdatePaginationEffect();
    }
  });

  return {
    savedArticles,
    pagination,
    error: formattedError,
    execute,
  };
};
