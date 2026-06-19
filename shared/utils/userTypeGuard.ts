import type { User } from '#auth-utils';

export const UserTypeGuard = {
  hasRole(user: User, role: User['role']): boolean {
    return user.role === role;
  },

  isAdmin(user: User): boolean {
    return user.role === 'admin';
  },

  isAdminOrModerator(user: User): boolean {
    return user.role === 'admin' || user.role === 'moderator';
  },

  isModerator(user: User): boolean {
    return user.role === 'moderator';
  },

  isUser(user: User): boolean {
    return user.role === 'user';
  },
} as const;
