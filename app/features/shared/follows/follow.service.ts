import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type {
  Follow,
  FollowFilters,
  FollowInsert,
  FollowUpdate,
  FollowWithFollowing,
} from './follow.model';

import { FollowConfig } from './follow.config';

export const getFollows = async (
  filters: FollowFilters
): Promise<PaginationResult<Follow>> => {
  const client = useSupabaseClient();

  let query = client.from('follows').select(
    `
    *,
    follower:users!follower_id(*)
    `,
    { count: 'exact' }
  );

  if (filters.follower_id) {
    query = query.eq('follower_id', filters.follower_id);
  }

  if (filters.following_id) {
    query = query.eq('following_id', filters.following_id);
  }

  const page = filters.page ?? FollowConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? FollowConfig.PAGE_SIZE_DEFAULT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { count, data, error } = await query;

  if (error) throw error;

  return {
    count: count ?? 0,
    data: data ?? [],
  };
};

export const getFollowsCount = async (
  filters: FollowFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client
    .from('follows')
    .select('id', { count: 'exact', head: true });

  if (filters.follower_id) {
    query = query.eq('follower_id', filters.follower_id);
  }

  if (filters.following_id) {
    query = query.eq('following_id', filters.following_id);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const getFollow = async (id: string): Promise<Follow | null> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('follows')
    .select(
      `
    *,
    follower:users!follower_id(*)
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createFollow = async (follow: FollowInsert): Promise<Follow> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('follows')
    .insert(follow)
    .select(
      `
    *,
    follower:users!follower_id(*)
    `
    )
    .single();

  if (error) throw error;

  return data;
};

export const updateFollow = async (
  id: string,
  updates: FollowUpdate
): Promise<Follow> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('follows')
    .update(updates)
    .eq('id', id)
    .select(
      `
    *,
    follower:users!follower_id(*)
    `
    )
    .single();

  if (error) throw error;

  return data;
};

export const deleteFollow = async (id: string): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client.from('follows').delete().eq('id', id);

  if (error) throw error;
};

export const getFollowing = async (
  filters: FollowFilters
): Promise<PaginationResult<FollowWithFollowing>> => {
  const client = useSupabaseClient();

  let query = client.from('follows').select(
    `
    *,
    following:users!following_id(*)
    `,
    { count: 'exact' }
  );

  if (filters.follower_id) {
    query = query.eq('follower_id', filters.follower_id);
  }

  if (filters.following_id) {
    query = query.eq('following_id', filters.following_id);
  }

  const page = filters.page ?? FollowConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? FollowConfig.PAGE_SIZE_DEFAULT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { count, data, error } = await query;

  if (error) throw error;

  return {
    count: count ?? 0,
    data: data ?? [],
  };
};
