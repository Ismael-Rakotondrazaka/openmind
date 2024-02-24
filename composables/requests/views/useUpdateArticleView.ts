import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useUpdateArticleView = (payload: {
  viewId: MaybeRefOrGetter<number>;
}) => {
  const url = computed(() => `/api/views/${toValue(payload.viewId)}`);

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<UpdateViewData["view"] | null>;
    error: Ref<FetchError<UpdateViewError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch(url, {
    method: "PUT",
    immediate: false,
    watch: false,
    transform: (data): UpdateViewData["view"] | null | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        const viewFull: ViewFull = StoreViewDataSchema.parse(data).view;

        return viewFull;
      }
    },
  });

  const formattedError = computed<UpdateViewError | null>(() => {
    if (error.value === null || error.value.data === undefined) {
      return null;
    } else {
      return error.value.data;
    }
  });

  const view = ref<View | null>(null);

  watch(data, (newValue) => {
    if (newValue === null) {
      view.value = null;
    } else {
      const formattedView: View = {
        id: newValue.id,
        articleId: newValue.articleId,
        userId: newValue.userId,
        updatedAt: newValue.updatedAt,
        createdAt: newValue.createdAt,
      };

      view.value = formattedView;
    }
  });

  return {
    view,
    viewFull: data,
    error: formattedError,
    execute,
  };
};
