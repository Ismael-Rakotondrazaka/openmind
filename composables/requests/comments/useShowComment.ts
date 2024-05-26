import type { AsyncData } from "#app/composables/asyncData";
import { type FetchError } from "ofetch";
import { type Comment } from "~/prisma/generated/zod";
import { filterComment } from "~/utils";

export const useShowComment = (payload: {
  param: MaybeRefOrGetter<ShowCommentParam>;
  immediate?: boolean;
}) => {
  const { immediate, param } = payload;

  const formattedUrl = computed(() => `/api/comments/${toValue(param).id}`);

  const {
    data,
    execute,
    error,
  }: AsyncData<
    ShowCommentData["comment"] | null,
    FetchError<StoreCommentError> | null
  > = useFetch(formattedUrl, {
    method: "GET",
    immediate: immediate,
    watch: immediate === false ? false : [formattedUrl],
    transform: (data): ShowCommentData["comment"] | null => {
      if (data !== null && data !== undefined) {
        const commentFull: CommentFull =
          ShowCommentDataSchema.parse(data).comment;

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
