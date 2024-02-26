import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useShowUser = (payload: {
  params: MaybeRefOrGetter<ShowUserParam>;
  immediate?: boolean;
}) => {
  const formattedUrl = computed(
    () => `/api/users/${toValue(payload.params).id}`,
  );

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<ShowUserData | null>;
    error: Ref<FetchError<ShowUserError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch(formattedUrl, {
    method: "GET",
    immediate: payload.immediate,
    watch: [formattedUrl],
    transform: (data): ShowUserData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return ShowUserDataSchema.parse(data);
      }
    },
  });

  /* ---------------------------------- User ---------------------------------- */

  const user = ref<UserFull | null>(data.value?.user ?? null);
  const computeUser = (): UserFull | null => {
    if (data.value === null) {
      return null;
    } else {
      return data.value.user;
    }
  };
  const setUser = (value: UserFull | null) => {
    user.value = value;
  };
  watchImmediate(computeUser, setUser, {
    deep: true,
  });

  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  onServerPrefetch(async () => {
    if (payload.immediate === true) {
      await execute();

      setUser(computeUser());
    }
  });

  return {
    user,
    error: formattedError,
    execute,
  };
};
