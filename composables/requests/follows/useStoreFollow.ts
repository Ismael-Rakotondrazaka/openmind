import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";
import { type FetchError } from "ofetch";
import { type Follow, filterFollow } from "~/utils";

export const useStoreFollow = (payload: {
  body: MaybeRefOrGetter<StoreFollowBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<StoreFollowData["follow"] | null>;
    error: Ref<FetchError<StoreFollowError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch("/api/follows", {
    method: "POST",
    body: formattedBody,
    immediate: false,
    watch: false,
    transform: (data): StoreFollowData["follow"] | null => {
      if (data !== null && data !== undefined) {
        const followFull: FollowFull = StoreFollowDataSchema.parse(data).follow;

        return followFull;
      } else {
        return null;
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
    error: formattedError,
    execute,
  };
};
