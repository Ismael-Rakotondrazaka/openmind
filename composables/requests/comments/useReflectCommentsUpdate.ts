import { setProperty } from "dot-prop";

export type UseReflectCommentsUpdateFnData = Partial<Flatten<CommentFull>>;

export type UseReflectCommentsUpdateFnDataKeys = keyof Flatten<CommentFull>;

export type UseReflectCommentsUpdateFn = (
  // eslint-disable-next-line no-unused-vars
  id: string,
  // eslint-disable-next-line no-unused-vars
  data: UseReflectCommentsUpdateFnData,
) => void;

export const useReflectCommentsUpdate = (payload: {
  comments: Ref<CommentFull[] | null>;
}) => {
  const update: UseReflectCommentsUpdateFn = (
    id: string,
    data: UseReflectCommentsUpdateFnData,
  ) => {
    let comment: CommentFull | undefined;

    if (payload.comments.value !== null) {
      comment = payload.comments.value.find(
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
  };

  return {
    update,
  };
};
