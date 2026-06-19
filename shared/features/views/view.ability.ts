import type { User } from '#auth-utils';

export const RecordViewAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);
