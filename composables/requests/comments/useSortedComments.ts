import { setProperty } from "dot-prop";

export type UseCommentsUpdateFnData = Partial<Flatten<CommentFull>>;

export type UseCommentsUpdateFnDataKeys = keyof Flatten<CommentFull>;

export type UseCommentsUpdateFn = (
  id: string,
  data: UseCommentsUpdateFnData,
) => void;

export const useSortedComments = (payload: {
  parent: MaybeRefOrGetter<CommentFull | null>;
}) => {
  const idsSet = ref(new Set<string>());

  const parent = computed<CommentFull | null>(() => toValue(payload.parent));
  const comments = ref<CommentFull[]>([]);

  const update: UseCommentsUpdateFn = (
    id: string,
    data: UseCommentsUpdateFnData,
  ) => {
    if (idsSet.value.has(id)) {
      let comment: CommentFull | undefined;

      if (comments.value !== null) {
        comment = comments.value.find(
          (comment: CommentFull) => comment.id === id,
        );
      }

      if (comment !== undefined) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const element: unknown = data[key as keyof typeof data];

            if (element !== undefined) {
              setProperty(comment, key, element);
            }
          }
        }
      }
    }
  };

  const isCommentCanBeAdded = (comment: CommentFull) => {
    const commentsParentId: string | null =
      parent.value !== null ? parent.value.id : null;
    const newCommentParentId = comment.parentId;
    const isNewCommentHaveSameParent = commentsParentId === newCommentParentId;
    const isNewCommentAlreadyIncluded = idsSet.value.has(comment.id);

    return isNewCommentHaveSameParent && !isNewCommentAlreadyIncluded;
  };

  const mergeAndSort = (...newComments: CommentFull[]) => {
    comments.value = [...comments.value, ...newComments].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  };

  const add = (comment: CommentFull) => {
    if (isCommentCanBeAdded(comment)) {
      idsSet.value.add(comment.id);

      mergeAndSort(comment);
    }
  };

  const addMany = (newComments: CommentFull[]) => {
    const newCommentsFiltered = newComments.filter(
      (newComment: CommentFull) => {
        if (isCommentCanBeAdded(newComment)) {
          idsSet.value.add(newComment.id);
          return true;
        } else {
          return false;
        }
      },
    );

    if (newCommentsFiltered.length > 0) {
      mergeAndSort(...newCommentsFiltered);
    }
  };

  const reset = () => {
    comments.value = [];

    idsSet.value.clear();
  };

  const remove = (id: string) => {
    const isIdIncluded = idsSet.value.has(id);

    if (isIdIncluded) {
      idsSet.value.delete(id);

      comments.value = comments.value.filter(
        (comment: CommentFull) => comment.id !== id,
      );
    }
  };

  return {
    comments,
    idsSet,
    update,
    add,
    addMany,
    reset,
    remove,
  };
};
