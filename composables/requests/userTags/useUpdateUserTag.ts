import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";

export const useUpdateUserTag = (payload: {
  body: MaybeRefOrGetter<UpdateUserTagBody>;
  immediate?: boolean;
}) => {
  const { immediate, body } = payload;

  const formattedBody = computed<UpdateUserTagBody>(() => toValue(body));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<UpdateUserTagData | null>;
    error: Ref<FetchError<UpdateUserTagError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
  } = useFetch("/api/user-tags", {
    method: "PUT",
    watch: false,
    body: formattedBody,
    immediate,
    transform: (data): UpdateUserTagData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return data as UpdateUserTagData;
      }
    },
  });

  /* -------------------------------- UserTags ------------------------------- */
  const tags = ref<Tag[] | null>(data.value?.tags ?? []);

  const onUpdateUserTagsEffect = () => {
    if (data.value === null) {
      tags.value = null;
    } else {
      tags.value = data.value.tags;
    }
  };

  watchEffect(onUpdateUserTagsEffect);
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  onServerPrefetch(async () => {
    if (payload.immediate === true) {
      await execute();

      onUpdateUserTagsEffect();
    }
  });

  return {
    tags,
    error: formattedError,
    execute,
  };
};
