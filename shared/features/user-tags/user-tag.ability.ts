import type { User } from '#auth-utils';

export const IndexUserTagsAbility = defineAbility((_user: null | User) => true);
export const CreateUserTagAbility = defineAbility((user: User) => !!user);
export const DeleteUserTagAbility = defineAbility((user: User) => !!user);
export const UpdateUserTagAbility = defineAbility((user: User) => !!user);
