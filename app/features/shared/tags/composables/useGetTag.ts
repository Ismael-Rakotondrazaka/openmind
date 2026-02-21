import { getTag } from '~/features/shared/tags/tag.service';

export const useGetTag = (id?: string) => {
  return useQuery({
    queryFn: async () => {
      if (!id) {
        return null;
      }

      return getTag(id);
    },
    queryKey: ['tags', id],
  });
};
