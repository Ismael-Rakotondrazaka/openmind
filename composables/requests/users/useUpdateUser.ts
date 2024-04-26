import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useUpdateUser = (payload: {
  params: MaybeRefOrGetter<UpdateUserParam>;
  body: MaybeRefOrGetter<UpdateUserBody>;
  immediate?: boolean;
}) => {
  const { params, body, immediate } = payload;

  const formattedUrl = computed(() => `/api/users/${toValue(params).username}`);

  const formattedBody = computed<FormData | UpdateUserBody>(() => {
    const rawBody: UpdateUserBody = toValue(body);

    if (rawBody.profile instanceof File) {
      const formData = new FormData();

      if (rawBody.firstName !== undefined) {
        formData.append("firstName", rawBody.firstName);
      }
      if (rawBody.name !== undefined) {
        formData.append("name", rawBody.name);
      }
      if (rawBody.profile !== undefined) {
        formData.append("profile", rawBody.profile);
      }

      return formData;
    } else {
      return rawBody;
    }
  });

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<UpdateUserData | null>;
    error: Ref<FetchError<UpdateUserError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
  } = useFetch(formattedUrl, {
    method: "PUT",
    body: formattedBody,
    immediate,
    watch: false,
    transform: (data): UpdateUserData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return UpdateUserDataSchema.parse(data);
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
    if (immediate === true) {
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
