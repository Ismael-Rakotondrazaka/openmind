import type { User } from '#auth-utils';

import { UserTypeGuard } from '../../utils/userTypeGuard';

export const IndexPostsAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);

export const ShowPostAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);

export const StorePostAbility = defineAbility((user: User) => !!user);

export const UpdatePostAbility = defineAbility(
  (user: User, post: { authorId: string }) => {
    return user.id === post.authorId || UserTypeGuard.isAdminOrModerator(user);
  }
);

export const DestroyPostAbility = defineAbility(
  (user: User, post: { authorId: string }) => {
    return user.id === post.authorId || UserTypeGuard.isAdminOrModerator(user);
  }
);

export const PublishPostAbility = defineAbility(
  (user: User, post: { authorId: string }) => {
    return user.id === post.authorId || UserTypeGuard.isAdminOrModerator(user);
  }
);

export const PresignPostFileAbility = defineAbility((user: User) => !!user);
