import type { User } from '#auth-utils';

export const IndexSavedPostsAbility = defineAbility((user: User) => !!user);

export const IsSavedPostAbility = defineAbility((user: User) => !!user);

export const ToggleSavedPostAbility = defineAbility((user: User) => !!user);
