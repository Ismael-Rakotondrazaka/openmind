import type { H3Event$Fetch } from 'nitropack/types';

export type WithFetchFn<T extends object = object> = {
  fetchFn?: H3Event$Fetch | typeof $fetch;
} & T;
