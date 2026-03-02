import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type {
  SavedPost,
  SavedPostFilters,
  SavedPostInsert,
  SavedPostUpdate,
} from './saved-post.model';

import { SavedPostConfig } from './saved-post.config';

const SAVED_POST_SELECT = `
  *,
  post:post_id(
    *,
    author:author_id(*),
    tags:post_tags(tag:tag_id(*))
  )
` as const;

export const getSavedPosts = async (
  filters: SavedPostFilters
): Promise<PaginationResult<SavedPost>> => {
  const client = useSupabaseClient();

  let query = client
    .from('saved_posts')
    .select(SAVED_POST_SELECT, { count: 'exact' });

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const page = filters.page ?? SavedPostConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? SavedPostConfig.PAGE_SIZE_DEFAULT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { count, data, error } = await query;

  if (error) throw error;

  return {
    count: count ?? 0,
    data: (data ?? []) as unknown as SavedPost[],
  };
};

export const getSavedPostsCount = async (
  filters: SavedPostFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client
    .from('saved_posts')
    .select('user_id', { count: 'exact', head: true });

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const createSavedPost = async (
  savedPost: SavedPostInsert
): Promise<SavedPost> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('saved_posts')
    .insert(savedPost)
    .select(SAVED_POST_SELECT)
    .single();

  if (error) throw error;

  return data as unknown as SavedPost;
};

export const deleteSavedPost = async (
  userId: string,
  postId: string
): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client
    .from('saved_posts')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) throw error;
};

export const updateSavedPost = async (
  userId: string,
  postId: string,
  updates: SavedPostUpdate
): Promise<SavedPost> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('saved_posts')
    .update(updates)
    .eq('user_id', userId)
    .eq('post_id', postId)
    .select(SAVED_POST_SELECT)
    .single();

  if (error) throw error;

  return data as unknown as SavedPost;
};

export const isPostSaved = async (
  userId: string,
  postId: string
): Promise<boolean> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('saved_posts')
    .select('user_id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();

  if (error) throw error;

  return data !== null;
};
