import { type FetchError } from "ofetch";
import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";

export const useDestroyFollow = (payload: {
  followId: MaybeRefOrGetter<number>;
}) => {
  const url = computed<string>(
    () => `/api/follows/${toValue(payload.followId)}`,
  );

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<DestroyFollowData["follow"] | null>;
    error: Ref<FetchError<DestroyFollowError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
  } = useFetch(url, {
    method: "DELETE",
    immediate: false,
    watch: false,
    transform: (data) => {
      if (data === undefined || data === null) {
        return null;
      } else {
        return DestroyFollowDataSchema.parse(data).follow;
      }
    },
  });

  /* -------------------------------- Follow -------------------------------- */
  const follow = ref<Follow | null>(null);

  const onUpdateFollowEffect = () => {
    if (data.value === null) {
      follow.value = null;
    } else {
      follow.value = filterFollow(data.value);
    }
  };

  watchEffect(onUpdateFollowEffect);
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  return {
    follow,
    followFull: data,
    execute,
    error: formattedError,
  };
};
