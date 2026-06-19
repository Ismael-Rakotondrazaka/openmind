import type { RecordViewBody } from '#shared/features/views';

import { defineMutation } from '@pinia/colada';

import { recordView } from './view.service';

export const useRecordView = defineMutation(() => {
  return {
    mutation: ({ body }: { body: RecordViewBody }) => recordView(body),
  };
});
