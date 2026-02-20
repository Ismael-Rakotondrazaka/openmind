import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import { UserConfig } from './user.config';

export const getUsernames = async ({
  limit,
  username,
}: {
  limit?: number;
  username?: string;
}): Promise<PaginationResult<string>> => {
  const userSBClient = useSupabaseClient();

  let query = userSBClient.from('users').select('username');

  if (username) {
    query = query.eq('username', username);
  }

  query = query.limit(limit ?? UserConfig.PAGE_SIZE_DEFAULT);

  const { count, data, error } = await query;

  if (error) {
    throw error;
  }

  return {
    count: count ?? 0,
    data: data.reduce((acc, user) => {
      if (user.username) {
        acc.push(user.username);
      }
      return acc;
    }, [] as string[]),
  };
};
