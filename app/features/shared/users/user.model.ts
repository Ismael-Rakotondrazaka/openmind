export const Roles = ['admin', 'moderator', 'user'] as const;

export const Role = createEnumConstants(Roles);

export type Role = (typeof Role)[keyof typeof Role];

export const RoleLabel: Record<Role, string> = {
  [Role.admin]: 'Admin',
  [Role.moderator]: 'Moderator',
  [Role.user]: 'User',
};

export type User = Tables<'users'>;

export interface UserFilters {
  limit?: number;
  page?: number;
  role?: Role;
  search?: string;
  username?: string;
}

export type UserInsert = TablesInsert<'users'>;
export interface UserMetadata {
  first_name?: null | string;
  image_url?: null | string;
  last_name?: null | string;
}

export type UserUpdate = TablesUpdate<'users'>;
