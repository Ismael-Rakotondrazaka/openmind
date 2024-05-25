import type { AsyncData } from "#app/composables/asyncData";
import type { Follow } from "@prisma/client";
import { type FetchError } from "ofetch";

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
    pending,
    status,
  }: AsyncData<
    DestroyFollowData["follow"] | null,
    FetchError<DestroyFollowError> | null
  > = useFetch(url, {
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

  const isStatusPending = computed<boolean>(() => status.value === "pending");

  return {
    follow,
    followFull: data,
    error: formattedError,
    pending,
    isStatusPending,
    execute,
  };
};
