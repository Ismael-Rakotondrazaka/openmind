import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";
import type { Tag } from "@prisma/client";
import { type FetchError } from "ofetch";

export const useIndexUserTag = (payload: { immediate?: boolean }) => {
  const { immediate } = payload;

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<IndexUserTagData | null>;
    error: Ref<FetchError<IndexUserTagError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
  } = useFetch("/api/user-tags", {
    method: "GET",
    immediate,
    transform: (data): IndexUserTagData | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        return data as IndexUserTagData;
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
