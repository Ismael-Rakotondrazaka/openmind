import type { Tag } from '~/features/shared/tags/tag.model';

import { getTags } from '~/features/shared/tags/tag.service';

export const useFindTagByValue = () => {
  const findTagByValue = async (value: string): Promise<null | Tag> => {
    const { data } = await getTags({ limit: 1, search: value });
    return data?.find(t => t.value === value) ?? null;
  };

  return findTagByValue;
};
