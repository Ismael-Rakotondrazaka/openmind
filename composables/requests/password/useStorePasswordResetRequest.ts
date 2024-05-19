import type {
  AsyncDataExecuteOptions,
  AsyncDataRequestStatus,
} from "#app/composables/asyncData";
import { type FetchError } from "ofetch";
import { type StorePasswordResetRequestBody } from "~/utils";

export const useStorePasswordResetRequest = (payload: {
  body: MaybeRefOrGetter<StorePasswordResetRequestBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    execute,
    error,
    pending,
    status,
  }: {
    data: Ref<StorePasswordResetRequestData["message"] | null>;
    error: Ref<FetchError<StorePasswordResetRequestError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
    pending: Ref<boolean>;
    status: Ref<AsyncDataRequestStatus>;
  } = useFetch("/api/password/reset-request", {
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
