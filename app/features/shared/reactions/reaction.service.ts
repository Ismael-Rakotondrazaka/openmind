import type { SortOrder } from '#imports';

import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type {
  Reaction,
  ReactionFilters,
  ReactionInsert,
  ReactionUpdate,
  ReactionUserPreview,
  ReactionWithUser,
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
    data: (data as Reaction[]) ?? [],
  };
};

const REACTIONS_WITH_USER_SELECT = '*, user:user_id(*)';

export const getReactionsWithUsers = async (
  filters: ReactionFilters
): Promise<PaginationResult<ReactionWithUser>> => {
  const client = useSupabaseClient();

  let query = client
    .from('reactions')
    .select(REACTIONS_WITH_USER_SELECT, { count: 'exact' });

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
    data: (data as ReactionWithUser[]) ?? [],
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

  return data as null | Reaction;
};

export const getUserReactionToPost = async (
  userId: string,
  postId: string
): Promise<null | Reaction> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('reactions')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();

  if (error) throw error;

  return data as null | Reaction;
};

export const getUserReactionToComment = async (
  userId: string,
  commentId: string
): Promise<null | Reaction> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('reactions')
    .select('*')
    .eq('user_id', userId)
    .eq('comment_id', commentId)
    .maybeSingle();

  if (error) throw error;

  return data as null | Reaction;
};

export const hasUserReactedToPost = async (
  userId: string,
  postId: string
): Promise<boolean> => {
  const reaction = await getUserReactionToPost(userId, postId);
  return reaction !== null;
};

export const hasUserReactedToComment = async (
  userId: string,
  commentId: string
): Promise<boolean> => {
  const reaction = await getUserReactionToComment(userId, commentId);
  return reaction !== null;
};

const REACTION_USER_SELECT =
  'user:user_id(id, first_name, last_name, username)';

export interface GetUsersWhoReactedToPostParams {
  excludeUserId?: string;
  limit?: number;
  orderBy?: 'created_at';
  postId: string;
  sortOrder?: SortOrder;
}

export const getUsersWhoReactedToPost = async (
  params: GetUsersWhoReactedToPostParams
): Promise<ReactionUserPreview[]> => {
  const client = useSupabaseClient();

  const { excludeUserId, limit, orderBy, postId, sortOrder = 'desc' } = params;

  let query = client
    .from('reactions')
    .select(REACTION_USER_SELECT)
    .eq('post_id', postId);

  if (orderBy) {
    query = query.order(orderBy, { ascending: sortOrder === 'asc' });
  }

  if (excludeUserId) {
    query = query.neq('user_id', excludeUserId);
  }

  if (limit != null && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  const users = (data ?? [])
    .map(row => (row as { user: ReactionUserPreview }).user)
    .filter((user): user is ReactionUserPreview => user != null);

  return users;
};

export const getUsersWhoReactedToComment = async (
  commentId: string,
  excludeUserId?: string
): Promise<ReactionUserPreview[]> => {
  const client = useSupabaseClient();

  let query = client
    .from('reactions')
    .select(REACTION_USER_SELECT)
    .eq('comment_id', commentId);

  if (excludeUserId) {
    query = query.neq('user_id', excludeUserId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const users = (data ?? [])
    .map(row => (row as { user: ReactionUserPreview }).user)
    .filter((user): user is ReactionUserPreview => user != null);

  return users;
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

  return data as Reaction;
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

  return data as Reaction;
};

export const deleteReaction = async (id: string): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client.from('reactions').delete().eq('id', id);

  if (error) throw error;
};
