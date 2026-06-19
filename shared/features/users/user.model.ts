import type { UserModel } from '../../../prisma/generated/client/models';

export type { UserModel };

export type User = UserProfile;

export type UserProfile = Pick<
  UserModel,
  | 'createdAt'
  | 'firstName'
  | 'followerCount'
  | 'followingCount'
  | 'id'
  | 'imageUrl'
  | 'lastName'
  | 'postsCount'
  | 'role'
  | 'username'
>;

export type UserRole = 'admin' | 'moderator' | 'user';

export const Roles = ['admin', 'moderator', 'user'] as const;

export const Role = {
  admin: 'admin',
  moderator: 'moderator',
  user: 'user',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const RoleLabelKeys: Record<Role, string> = {
  admin: 'users.roles.admin',
  moderator: 'users.roles.moderator',
  user: 'users.roles.user',
};

export const getRoleLabel = (
  role: Role,
  t: (key: string) => string
): string => {
  return t(RoleLabelKeys[role]);
};
