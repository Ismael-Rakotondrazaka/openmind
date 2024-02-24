import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";
import { type FetchError } from "ofetch";

export type UseStoreViewReturn = {
  view: Ref<View | null>;
  viewFull: Ref<ViewFull | null>;
  error: ComputedRef<StoreViewError | null>;
  // eslint-disable-next-line no-unused-vars
  execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
};

export const useStoreArticleView = (payload: {
  body: MaybeRefOrGetter<StoreViewBody>;
}): UseStoreViewReturn => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<StoreViewData["view"] | null>;
    error: Ref<FetchError<StoreViewError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch("/api/views", {
    method: "POST",
    body: formattedBody,
    immediate: false,
    watch: false,
    transform: (data): StoreViewData["view"] | null | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        const viewFull: ViewFull = StoreViewDataSchema.parse(data).view;

        return viewFull;
      }
    },
  });

  const formattedError = computed<StoreViewError | null>(() => {
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
        createdAt: newValue.createdAt,
        updatedAt: newValue.updatedAt,
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
