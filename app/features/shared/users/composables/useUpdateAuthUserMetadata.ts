import type { UserMetadata } from '../user.model';

import { updateAuthUserMetadata } from '../user.service';

export const useUpdateAuthUserMetadata = () => {
  return useMutation({
    mutationFn: async (metadata: UserMetadata) => {
      return updateAuthUserMetadata(metadata);
    },
  });
};
