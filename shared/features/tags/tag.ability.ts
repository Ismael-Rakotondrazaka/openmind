import type { User } from '#auth-utils';

import { UserTypeGuard } from '../../utils/userTypeGuard';

export const IndexTagsAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);

export const StoreTagAbility = defineAbility((user: User) => !!user);

export const DestroyTagAbility = defineAbility((user: User) =>
  UserTypeGuard.isAdmin(user)
);
