import type { AsyncData } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";
import { type StoreAccountActivateBody } from "~/utils";

export const useStoreActivateAccount = (payload: {
  body: MaybeRefOrGetter<StoreAccountActivateBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
    pending,
    status,
  }: AsyncData<
    StoreAccountActivateData | null,
    FetchError<StoreAccountActivateError> | null
  > = useFetch("/api/account/activate", {
    method: "POST",
    body: formattedBody,
    immediate: false,
    watch: false,
  });

  const formattedError = useFetchErrorData(error);

  const isStatusPending = computed<boolean>(() => status.value === "pending");

  return {
    data,
    error: formattedError,
    execute,
    pending,
    isStatusPending,
  };
};
