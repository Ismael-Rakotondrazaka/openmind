import type {
  Constants,
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '../../../../../types/database/schema.ts';

import { createEnumConstants } from '../../utils/enums.ts';

export type PostProcessingStatus = Enums<'post_processing_status'>;

export const PostProcessingStatus = createEnumConstants(
  Constants.public.Enums.post_processing_status
);

export const PostProcessingStatuss =
  Constants.public.Enums.post_processing_status;

export const PostProcessingStatusLabel: Record<PostProcessingStatus, string> = {
  [PostProcessingStatus.filtered]: 'Filtré',
  [PostProcessingStatus.pending]: 'En attente',
  [PostProcessingStatus.processed]: 'Traité',
  [PostProcessingStatus.rejected]: 'Rejeté',
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

export type PostInsert = TablesInsert<'posts'>;
export type PostUpdate = TablesUpdate<'posts'>;
