import type { User } from '#auth-utils';

export const IndexReactionsAbility = defineAbility(
  { allowGuest: true },
  (_user: null | User) => true
);

export const ToggleReactionAbility = defineAbility((user: User) => !!user);
