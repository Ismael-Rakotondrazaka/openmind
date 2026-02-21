import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type {
  Reaction,
  ReactionFilters,
  ReactionInsert,
  ReactionUpdate,
} from './reaction.model';

import { ReactionConfig } from './reaction.config';

export const getReactions = async (
  filters: ReactionFilters
): Promise<PaginationResult<Reaction>> => {
  const client = useSupabaseClient();

  let query = client.from('reactions').select('*', { count: 'exact' });

  if (filters.comment_id) {
    query = query.eq('comment_id', filters.comment_id);
  }

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const page = filters.page ?? ReactionConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? ReactionConfig.PAGE_SIZE_DEFAULT;
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

export const getReactionsCount = async (
  filters: ReactionFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client
    .from('reactions')
    .select('id', { count: 'exact', head: true });

  if (filters.comment_id) {
    query = query.eq('comment_id', filters.comment_id);
  }

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const getReaction = async (id: string): Promise<null | Reaction> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('reactions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createReaction = async (
  reaction: ReactionInsert
): Promise<Reaction> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('reactions')
    .insert(reaction)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateReaction = async (
  id: string,
  updates: ReactionUpdate
): Promise<Reaction> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('reactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteReaction = async (id: string): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client.from('reactions').delete().eq('id', id);

  if (error) throw error;
};
