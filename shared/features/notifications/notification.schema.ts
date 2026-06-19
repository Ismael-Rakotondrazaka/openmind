import { z } from 'zod';

import { NotificationChannel, NotificationGroup } from './notification.model';

export const IndexNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  unreadOnly: z
    .string()
    .transform(v => v === 'true')
    .optional(),
});

export const MarkNotificationsReadBodySchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
});

export const UpdateNotificationPreferenceBodySchema = z.object({
  channel: z.nativeEnum(NotificationChannel),
  enabled: z.boolean(),
  groupName: z.nativeEnum(NotificationGroup),
});

export const NotificationParamsSchema = z.object({
  notificationId: z.string().uuid(),
});

export type IndexNotificationsQuery = z.infer<
  typeof IndexNotificationsQuerySchema
>;
export type MarkNotificationsReadBody = z.infer<
  typeof MarkNotificationsReadBodySchema
>;
export type NotificationParams = z.infer<typeof NotificationParamsSchema>;
export type UpdateNotificationPreferenceBody = z.infer<
  typeof UpdateNotificationPreferenceBodySchema
>;
