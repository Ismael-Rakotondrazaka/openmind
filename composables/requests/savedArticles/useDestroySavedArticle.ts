import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useDestroySavedArticle = (payload: {
  articleId: MaybeRefOrGetter<string>;
}) => {
  const url = computed(
    () => `/api/saved-articles/${toValue(payload.articleId)}`,
  );

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<DestroySavedArticleData["article"] | null>;
    error: Ref<FetchError<DestroySavedArticleError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch(url, {
    method: "DELETE",
    immediate: false,
    watch: false,
    transform: (data): DestroySavedArticleData["article"] | null | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        const articleFull: ArticleFull =
          DestroySavedArticleDataSchema.parse(data).article;

        return articleFull;
      }
    },
  });

  const formattedError = computed<DestroySavedArticleError | null>(() => {
    if (error.value === null || error.value.data === undefined) {
      return null;
    } else {
      return error.value.data;
    }
  });

  const article = ref<Article | null>(null);

  watch(data, (newValue) => {
    if (newValue === null) {
      article.value = null;
    } else {
      const formattedArticle: Article = {
        id: newValue.id,
        title: newValue.title,
        content: newValue.content,
        coverUrl: newValue.coverUrl,
        createdAt: newValue.createdAt,
        deletedAt: newValue.deletedAt,
        userId: newValue.userId,
        isVisible: newValue.isVisible,
        slug: newValue.slug,
        summary: newValue.summary,
        updatedAt: newValue.updatedAt,
      };

      article.value = formattedArticle;
    }
  });

  return {
    article,
    articleFull: data,
    error: formattedError,
    execute,
  };
};
