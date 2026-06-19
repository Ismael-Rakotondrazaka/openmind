import type { User } from '#auth-utils';

export const ToggleFollowAbility = defineAbility((user: User) => !!user);
