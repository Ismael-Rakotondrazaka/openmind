import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useShowArticle = (payload: {
  param: MaybeRefOrGetter<ShowArticleParam>;
  immediate?: boolean;
}) => {
  const formattedUrl = computed(
    () => `/api/articles/${toValue(payload.param).slug}`,
  );

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<ShowArticleData | null>;
    error: Ref<FetchError<ShowArticleError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
  } = useFetch(formattedUrl, {
    method: "GET",
    immediate: payload.immediate,
    watch: [formattedUrl],
    transform: (data): ShowArticleData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return ShowArticleDataSchema.parse(data);
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
    if (payload.immediate === true) {
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
