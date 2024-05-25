import type { AsyncData } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useIndexArticle = (payload: {
  query: MaybeRefOrGetter<IndexArticleQuery>;
  immediate?: boolean;
}) => {
  const formattedQuery = computed(() =>
    JSONStringifyNested(toValue(payload.query)),
  );

  const {
    data,
    execute,
    error,
  }: AsyncData<IndexArticleData | null, FetchError<IndexArticleError> | null> =
    useFetch("/api/articles", {
      method: "GET",
      immediate: payload.immediate,
      watch: [formattedQuery],
      query: formattedQuery,
      transform: (data): IndexArticleData | null => {
        if (data === null || data === undefined) {
          return null;
        } else {
          return IndexArticleDataSchema.parse(data);
        }
      },
    });

  /* -------------------------------- Articles ------------------------------- */
  const articles = ref<ArticleFull[] | null>(data.value?.articles ?? null);

  const onUpdateArticlesEffect = () => {
    if (data.value === null) {
      articles.value = null;
    } else {
      articles.value = data.value.articles;
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
    articles,
    pagination,
    error: formattedError,
    execute,
  };
};
