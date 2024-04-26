import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useIndexUser = (payload: {
  query: MaybeRefOrGetter<IndexUserQuery>;
  immediate?: boolean;
}) => {
  const formattedQuery = computed(() =>
    JSONStringifyNested(toValue(payload.query)),
  );

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<IndexUserData | null>;
    error: Ref<FetchError<IndexUserError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
  } = useFetch("/api/users", {
    method: "GET",
    immediate: payload.immediate,
    watch: [formattedQuery],
    query: formattedQuery,
    transform: (data): IndexUserData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return IndexUserDataSchema.parse(data);
      }
    },
  });

  /* -------------------------------- Users ------------------------------- */
  const users = ref<UserFull[] | null>(data.value?.users ?? null);

  const onUpdateUsersEffect = () => {
    if (data.value === null) {
      users.value = null;
    } else {
      users.value = data.value.users;
    }
  };

  watchEffect(onUpdateUsersEffect);
  /* -------------------------------------------------------------------------- */

  /* ------------------------------- Pagination ------------------------------- */
  const pagination = ref<Pagination | null>(null);

  const onUpdatePaginationEffect = () => {
    if (data.value === null) {
      pagination.value = null;
    } else {
      pagination.value = filterPagination(data.value);
    }
  };

  watchEffect(onUpdatePaginationEffect);
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  onServerPrefetch(async () => {
    if (payload.immediate === true) {
      await execute();

      onUpdateUsersEffect();
      onUpdatePaginationEffect();
    }
  });

  return {
    users,
    pagination,
    error: formattedError,
    execute,
  };
};
