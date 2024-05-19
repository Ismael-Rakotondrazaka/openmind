import type {
  AsyncDataExecuteOptions,
  AsyncDataRequestStatus,
} from "#app/composables/asyncData";
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
  }: {
    data: Ref<StoreRegisterData["user"] | null>;
    error: Ref<FetchError<StoreRegisterError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
    pending: Ref<boolean>;
    status: Ref<AsyncDataRequestStatus>;
  } = useFetch("/api/register", {
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
