import type { AsyncData } from "#app/composables/asyncData";
import type { View } from "@prisma/client";
import { type FetchError } from "ofetch";

export const useStoreArticleView = (payload: {
  body: MaybeRefOrGetter<StoreViewBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
  }: AsyncData<
    StoreViewData["view"] | null,
    FetchError<StoreViewError> | null
  > = useFetch("/api/views", {
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
