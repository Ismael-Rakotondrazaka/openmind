import type { UserMetadata } from '../auth.model';

import { updateAuthUserMetadata } from '../auth.service';

export const useUpdateAuthUserMetadata = () => {
  return useMutation({
    mutationFn: async (metadata: UserMetadata) => {
      return updateAuthUserMetadata(metadata);
    },
  });
};
