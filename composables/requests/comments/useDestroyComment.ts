import type {
  AsyncDataExecuteOptions,
  AsyncDataRequestStatus,
} from "#app/composables/asyncData";
import { type FetchError } from "ofetch";
import { filterComment } from "~/utils";
import { type Comment } from "~/utils";

export const useDestroyComment = (payload: {
  params: MaybeRefOrGetter<DestroyCommentParam>;
}) => {
  const formattedUrl = computed<string>(
    () => `/api/comments/${toValue(payload.params).id}`,
  );

  const {
    data,
    execute,
    error,
    pending,
    status,
  }: {
    data: Ref<DestroyCommentData["comment"] | null>;
    error: Ref<FetchError<DestroyCommentError> | null>;
    execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
    pending: Ref<boolean>;
    status: Ref<AsyncDataRequestStatus>;
  } = useFetch(formattedUrl, {
    method: "DELETE",
    immediate: false,
    watch: false,
    transform: (data): DestroyCommentData["comment"] | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        const commentFull: CommentFull =
          DestroyCommentDataSchema.parse(data).comment;
        return commentFull;
      }
    },
  });

  /* -------------------------------- Comment -------------------------------- */
  const comment = ref<Comment | null>(null);

  const onDestroyCommentEffect = () => {
    if (data.value === null) {
      comment.value = null;
    } else {
      comment.value = filterComment(data.value);
    }
  };

  watchEffect(onDestroyCommentEffect);
  /* -------------------------------------------------------------------------- */

  const formattedError = useFetchErrorData(error);

  const isStatusPending = computed<boolean>(() => status.value === "pending");

  return {
    comment,
    commentFull: data,
    error: formattedError,
    pending,
    isStatusPending,
    execute,
  };
};
