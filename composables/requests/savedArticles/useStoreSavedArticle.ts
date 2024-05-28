import type { AsyncData } from "#app/composables/asyncData";
import type { SavedArticle } from "@prisma/client";
import { type FetchError } from "ofetch";

export const useStoreSavedArticle = (payload: {
  body: MaybeRefOrGetter<StoreSavedArticleBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
    status,
    pending,
  }: AsyncData<
    StoreSavedArticleData["savedArticle"] | null,
    FetchError<StoreSavedArticleError> | null
  > = useFetch("/api/saved-articles", {
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

  const isStatusPending = computed<boolean>(() => status.value === "pending");

  return {
    savedArticle,
    savedArticleFull: data,
    error: formattedError,
    pending,
    isStatusPending,
    execute,
  };
};
