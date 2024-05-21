import type {
  AsyncDataExecuteOptions,
  AsyncDataRequestStatus,
} from "#app/composables/asyncData";
import { type FetchError } from "ofetch";
import { type StorePasswordResetBody } from "~/utils";

export const useStorePasswordReset = (payload: {
  body: MaybeRefOrGetter<StorePasswordResetBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    execute,
    error,
    pending,
    status,
  }: {
    data: Ref<StorePasswordResetData["message"] | null>;
    error: Ref<FetchError<StorePasswordResetError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
    pending: Ref<boolean>;
    status: Ref<AsyncDataRequestStatus>;
  } = useFetch("/api/password/reset", {
    method: "POST",
    body: formattedBody,
    immediate: false,
    watch: false,
  });

  const formattedError = useFetchErrorData(error);

  const isStatusPending = computed<boolean>(() => status.value === "pending");

  return {
    error: formattedError,
    execute,
    pending,
    isStatusPending,
  };
};
