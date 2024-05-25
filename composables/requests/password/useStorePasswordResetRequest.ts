import type { AsyncData } from "#app/composables/asyncData";
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
  }: AsyncData<
    StorePasswordResetRequestData["message"] | null,
    FetchError<StorePasswordResetRequestError> | null
  > = useFetch("/api/password/reset-request", {
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
