import type { User } from '#auth-utils';

export const GetUnreadNotificationsCountAbility = defineAbility(
  (user: User) => !!user
);

export const IndexNotificationsAbility = defineAbility((user: User) => !!user);

export const MarkNotificationsReadAbility = defineAbility(
  (user: User) => !!user
);

export const DestroyNotificationAbility = defineAbility(
  (user: User, notification: { recipientId: string }) =>
    user.id === notification.recipientId
);

export const IndexNotificationPreferencesAbility = defineAbility(
  (user: User) => !!user
);

export const UpdateNotificationPreferenceAbility = defineAbility(
  (user: User) => !!user
);
