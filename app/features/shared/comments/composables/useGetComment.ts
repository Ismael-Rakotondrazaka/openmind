import { getComment } from '~/features/shared/comments/comment.service';

export const useGetComment = (id?: string) => {
  return useQuery({
    queryFn: async () => {
      if (!id) {
        return null;
      }

      return getComment(id);
    },
    queryKey: ['comments', id],
  });
};
