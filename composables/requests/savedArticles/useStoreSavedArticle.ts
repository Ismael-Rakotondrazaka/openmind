import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useStoreSavedArticle = (payload: {
  body: MaybeRefOrGetter<StoreSavedArticleBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<StoreSavedArticleData["savedArticle"] | null>;
    error: Ref<FetchError<StoreSavedArticleError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch("/api/saved-articles", {
    method: "POST",
    body: formattedBody,
    immediate: false,
    watch: false,
    transform: (data): StoreSavedArticleData["savedArticle"] | null | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        const savedArticleFull: SavedArticleFull =
          StoreSavedArticleDataSchema.parse(data).savedArticle;

        return savedArticleFull;
      }
    },
  });

  const formattedError = computed<StoreSavedArticleError | null>(() => {
    if (error.value === null || error.value.data === undefined) {
      return null;
    } else {
      return error.value.data;
    }
  });

  const savedArticle = ref<SavedArticle | null>(null);

  watch(data, (newValue) => {
    if (newValue === null) {
      savedArticle.value = null;
    } else {
      const formattedSavedArticle: SavedArticle = {
        articleId: newValue.articleId,
        createdAt: newValue.createdAt,
        userId: newValue.userId,
      };

      savedArticle.value = formattedSavedArticle;
    }
  });

  return {
    savedArticle,
    savedArticleFull: data,
    error: formattedError,
    execute,
  };
};
