import { type FetchError } from "ofetch";
import type {
  AsyncDataExecuteOptions,
  AsyncDataRequestStatus,
} from "#app/composables/asyncData";
import type { Follow } from "@prisma/client";

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
  }: {
    data: Ref<DestroyFollowData["follow"] | null>;
    error: Ref<FetchError<DestroyFollowError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
    pending: Ref<boolean>;
    status: Ref<AsyncDataRequestStatus>;
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
