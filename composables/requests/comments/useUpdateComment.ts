import type { AsyncData } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";
import { type Comment } from "~/prisma/generated/zod";
import { filterComment } from "~/utils";

export const useUpdateComment = (payload: {
  body: MaybeRefOrGetter<UpdateCommentBody>;
  params: MaybeRefOrGetter<UpdateCommentParam>;
}) => {
  const formattedBody = computed(() => toValue(payload.body));

  const formattedUrl = computed<string>(
    () => `/api/comments/${toValue(payload.params).id}`,
  );

  const {
    data,
    execute,
    error,
  }: AsyncData<
    UpdateCommentData["comment"] | null,
    FetchError<UpdateCommentError> | null
  > = useFetch(formattedUrl, {
    method: "PUT",
    body: formattedBody,
    immediate: false,
    watch: false,
    transform: (data): UpdateCommentData["comment"] | null => {
      if (data === null || data === undefined) {
        return null;
      } else {
        const commentFull: CommentFull =
          UpdateCommentDataSchema.parse(data).comment;
        return commentFull;
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
