import { type FetchError } from "ofetch";

export const useFetchErrorData = <T>(
  error: MaybeRefOrGetter<FetchError<T> | null>,
): Ref<T | null> => {
  const errorData = ref<T | null>(null) as Ref<T | null>;

  watch(
    () => toValue(error),
    (newValue) => {
      if (newValue === null || newValue.data === undefined) {
        errorData.value = null;
      } else {
        errorData.value = newValue.data;
      }
    },
  );

  return errorData;
};
