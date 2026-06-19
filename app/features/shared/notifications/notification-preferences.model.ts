export const NotificationPreferenceGroups = [
  'comments',
  'follows',
  'reactions',
] as const;

export const NotificationPreferenceGroup = createEnumConstants(
  NotificationPreferenceGroups
);

export type NotificationPreferenceGroup =
  (typeof NotificationPreferenceGroup)[keyof typeof NotificationPreferenceGroup];

// These keys should be translated in components using t('notifications.preferencesComments', etc.)
export const NotificationPreferenceGroupLabel: Record<
  NotificationPreferenceGroup,
  string
> = {
  [NotificationPreferenceGroup.comments]: 'notifications.preferencesComments',
  [NotificationPreferenceGroup.follows]: 'notifications.preferencesFollows',
  [NotificationPreferenceGroup.reactions]: 'notifications.preferencesReactions',
};

// These descriptions should be translated in components using t()
export const NotificationPreferenceGroupDescription: Record<
  NotificationPreferenceGroup,
  string
> = {
  [NotificationPreferenceGroup.comments]: 'notifications.descriptionComments',
  [NotificationPreferenceGroup.follows]: 'notifications.descriptionFollows',
  [NotificationPreferenceGroup.reactions]: 'notifications.descriptionReactions',
};

export const NotificationChannels = ['in_app'] as const;

export const NotificationChannel = createEnumConstants(NotificationChannels);

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export type NotificationPreference = Tables<'notification_preferences'>;

// Derived UI type: group → channel → enabled boolean.
// Built from raw DB rows in useGetNotificationPreferences.
export type NotificationPreferenceMap = Record<
  NotificationPreferenceGroup,
  Record<NotificationChannel, boolean>
>;
