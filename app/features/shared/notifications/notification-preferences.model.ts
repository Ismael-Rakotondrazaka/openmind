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

export const NotificationPreferenceGroupLabel: Record<
  NotificationPreferenceGroup,
  string
> = {
  [NotificationPreferenceGroup.comments]: 'Comments',
  [NotificationPreferenceGroup.follows]: 'Follows',
  [NotificationPreferenceGroup.reactions]: 'Reactions',
};

export const NotificationPreferenceGroupDescription: Record<
  NotificationPreferenceGroup,
  string
> = {
  [NotificationPreferenceGroup.comments]:
    'When someone comments on your posts or replies to your comments',
  [NotificationPreferenceGroup.follows]: 'When someone follows you',
  [NotificationPreferenceGroup.reactions]:
    'When someone reacts to your posts or comments',
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
