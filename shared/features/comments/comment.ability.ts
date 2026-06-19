import type { User } from '#auth-utils';

import { UserTypeGuard } from '../../utils/userTypeGuard';

export const IndexCommentsAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);

export const StoreCommentAbility = defineAbility((user: User) => !!user);

export const UpdateCommentAbility = defineAbility(
  (user: User, comment: { authorId: string }) => {
    return (
      user.id === comment.authorId || UserTypeGuard.isAdminOrModerator(user)
    );
  }
);

export const DestroyCommentAbility = defineAbility(
  (user: User, comment: { authorId: string }) => {
    return (
      user.id === comment.authorId || UserTypeGuard.isAdminOrModerator(user)
    );
  }
);
