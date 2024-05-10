import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useDestroyArticle = (payload: {
  param: MaybeRefOrGetter<DestroyArticleParam>;
  immediate?: boolean;
}) => {
  const { param, immediate = false } = payload;

  const formattedUrl = computed(() => `/api/articles/${toValue(param).slug}`);

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<DestroyArticleData | null>;
    error: Ref<FetchError<DestroyArticleError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
  } = useFetch(formattedUrl, {
    method: "DELETE",
    immediate,
    watch: false,
    transform: (data): DestroyArticleData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return DestroyArticleDataSchema.parse(data);
      }
    },
  });

  /* -------------------------------- Articles ------------------------------- */
  const article = ref<ArticleFull | null>(data.value?.article ?? null);

  const onUpdateArticlesEffect = () => {
    if (data.value === null) {
      article.value = null;
    } else {
      article.value = data.value.article;
    }
  };

  watchEffect(onUpdateArticlesEffect);
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  onServerPrefetch(async () => {
    if (immediate === true) {
      await execute();

      onUpdateArticlesEffect();
    }
  });

  return {
    article,
    error: formattedError,
    execute,
  };
};
