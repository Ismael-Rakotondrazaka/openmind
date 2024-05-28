import type { AsyncData } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";
import { type StoreRegisterBody } from "~/utils";

export const useStoreRegister = (payload: {
  body: MaybeRefOrGetter<StoreRegisterBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    execute,
    error,
    pending,
    status,
  }: AsyncData<
    StoreRegisterData["user"] | null,
    FetchError<StoreRegisterError> | null
  > = useFetch("/api/register", {
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
