import type {
  AsyncDataExecuteOptions,
  AsyncDataRequestStatus,
} from "#app/composables/asyncData";
import { type Follow } from "@prisma/client";
import { type FetchError } from "ofetch";
import { filterFollow } from "~/utils";

export const useStoreFollow = (payload: {
  body: MaybeRefOrGetter<StoreFollowBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
    pending,
    status,
  }: {
    data: Ref<StoreFollowData["follow"] | null>;
    error: Ref<FetchError<StoreFollowError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
    pending: Ref<boolean>;
    status: Ref<AsyncDataRequestStatus>;
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

  const isStatusPending = computed<boolean>(() => status.value === "pending");

  return {
    follow,
    followFull: data,
    error: formattedError,
    execute,
    pending,
    isStatusPending,
  };
};
