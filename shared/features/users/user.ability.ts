import type { User } from '#auth-utils';

import { UserTypeGuard } from '../../utils/userTypeGuard';

export const IndexUsersAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);

export const UsernameExistsAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);

export const ShowUserAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);

export const UpdateProfileAbility = defineAbility(
  (user: User, target: { id: string }) => {
    return user.id === target.id || UserTypeGuard.isAdmin(user);
  }
);

export const DestroyUserAbility = defineAbility((user: User) =>
  UserTypeGuard.isAdmin(user)
);
