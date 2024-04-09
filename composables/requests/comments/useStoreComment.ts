import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";
import { type FetchError } from "ofetch";
import { filterComment } from "~/utils";
import { type Comment } from "~/utils";

export const useStoreComment = (payload: {
  body: MaybeRefOrGetter<StoreCommentBody>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const {
    data,
    execute,
    error,
  }: {
    data: Ref<StoreCommentData["comment"] | null>;
    error: Ref<FetchError<StoreCommentError> | null>;
    execute: (
      // eslint-disable-next-line no-unused-vars
      opts?: AsyncDataExecuteOptions | undefined,
    ) => Promise<void>;
  } = useFetch("/api/comments", {
    method: "POST",
    body: formattedBody,
    immediate: false,
    watch: false,
    transform: (data): StoreCommentData["comment"] | null => {
      if (data !== null && data !== undefined) {
        const commentFull: CommentFull =
          StoreCommentDataSchema.parse(data).comment;

        return commentFull;
      } else {
        return null;
      }
    },
  });

  /* -------------------------------- Comment -------------------------------- */
  const comment = ref<Comment | null>(null);

  const onUpdateCommentEffect = () => {
    if (data.value === null) {
      comment.value = null;
    } else {
      comment.value = filterComment(data.value);
    }
  };

  watchEffect(onUpdateCommentEffect);
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  return {
    comment,
    commentFull: data,
    error: formattedError,
    execute,
  };
};
