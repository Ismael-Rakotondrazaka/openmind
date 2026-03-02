import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type {
  UserTag,
  UserTagFilters,
  UserTagInsert,
  UserTagUpdate,
  UserTagWithDetails,
} from './user-tag.model';

import { UserTagConfig } from './user-tag.config';

export const getUserTags = async (
  filters: UserTagFilters
): Promise<PaginationResult<UserTag>> => {
  const client = useSupabaseClient();

  let query = client.from('user_tags').select('*', { count: 'exact' });

  if (filters.tag_id) {
    query = query.eq('tag_id', filters.tag_id);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const page = filters.page ?? UserTagConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? UserTagConfig.PAGE_SIZE_DEFAULT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { count, data, error } = await query;

  if (error) throw error;

  return {
    count: count ?? 0,
    data: data ?? [],
  };
};

export const getUserTagsCount = async (
  filters: UserTagFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client
    .from('user_tags')
    .select('user_id', { count: 'exact', head: true });

  if (filters.tag_id) {
    query = query.eq('tag_id', filters.tag_id);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const createUserTag = async (
  userTag: UserTagInsert
): Promise<UserTag> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('user_tags')
    .insert(userTag)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteUserTag = async (
  userId: string,
  tagId: string
): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client
    .from('user_tags')
    .delete()
    .eq('user_id', userId)
    .eq('tag_id', tagId);

  if (error) throw error;
};

export const getUserTagsWithDetails = async (
  userId: string
): Promise<UserTagWithDetails[]> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('user_tags')
    .select('*, tag:tag_id(*)')
    .eq('user_id', userId);

  if (error) throw error;

  return (data ?? []) as unknown as UserTagWithDetails[];
};

export const updateUserTag = async (
  userId: string,
  tagId: string,
  updates: UserTagUpdate
): Promise<UserTag> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('user_tags')
    .update(updates)
    .eq('user_id', userId)
    .eq('tag_id', tagId)
    .select()
    .single();

  if (error) throw error;

  return data;
};
