import type {
  Constants,
  Database,
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/types/database/schema';

import { createEnumConstants } from '@/utils';

export type PostProcessingStatus = Enums<'post_processing_status'>;

export const PostProcessingStatus = createEnumConstants(
  Constants.public.Enums.post_processing_status
);

export const PostProcessingStatuses =
  Constants.public.Enums.post_processing_status;

export const PostProcessingStatusLabel: Record<PostProcessingStatus, string> = {
  [PostProcessingStatus.filtered]: 'Filtré',
  [PostProcessingStatus.pending]: 'En attente',
  [PostProcessingStatus.processed]: 'Traité',
  [PostProcessingStatus.rejected]: 'Rejeté',
};

export type PostStatus = Enums<'post_status'>;

export const PostStatus = createEnumConstants(
  Constants.public.Enums.post_status
);

export const PostStatuses = Constants.public.Enums.post_status;

export const PostStatusLabel: Record<PostStatus, string> = {
  [PostStatus.ignored]: 'Ignoré',
  [PostStatus.pending]: 'En attente',
  [PostStatus.processed]: 'Traité',
};

export type PostLabel = Enums<'post_label'>;

export const PostLabel = createEnumConstants(Constants.public.Enums.post_label);

export const PostLabels = Constants.public.Enums.post_label;

export const PostLabelLabel: Record<PostLabel, string> = {
  [PostLabel.buying_intent]: 'Achat',
  [PostLabel.irrelevant]: 'Non pertinent',
  [PostLabel.neutral]: 'Neutre',
  [PostLabel.pain_point]: 'Problème',
  [PostLabel.promo]: 'Promo',
};

export type Post = Tables<'posts'>;

export interface PostFilters {
  label?: PostLabel;
  platform?: Database['public']['Enums']['platform'];
  processing_status?: PostProcessingStatus;
  product_id?: string;
}

export type PostInsert = TablesInsert<'posts'>;
export type PostUpdate = TablesUpdate<'posts'>;
