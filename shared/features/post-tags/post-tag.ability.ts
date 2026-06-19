import type { User } from '#auth-utils';

export const IndexPostTagsAbility = defineAbility((_user: null | User) => true);
export const CreatePostTagAbility = defineAbility((user: User) => !!user);
export const DeletePostTagAbility = defineAbility((user: User) => !!user);
