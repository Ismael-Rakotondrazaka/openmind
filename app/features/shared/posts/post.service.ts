import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type { Post, PostFilters, PostInsert, PostUpdate } from './post.model';

import { PostConfig } from './post.config';

export const getPosts = async (
  filters: PostFilters
): Promise<PaginationResult<Post>> => {
  const postSBClient = useSupabaseClient();

  let query = postSBClient.from('posts').select(
    `
    *,
    author:author_id(*),
    tags:post_tags(tag:tag_id(*))
    `,
    { count: 'exact' }
  );

  if (filters.author_id) {
    query = query.eq('author_id', filters.author_id);
  }

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const page = filters.page ?? PostConfig.PAGE_DEFAULT;

  const limit = filters.limit ?? PostConfig.PAGE_SIZE_DEFAULT;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query
    .order(filters.orderBy ?? 'created_at', {
      ascending: filters.sortOrder === SortOrder.asc,
    })
    .range(from, to);

  const { count, data, error } = await query;

  if (error) throw error;

  return {
    count: count ?? 0,
    data: data ?? [],
  };
};

export const getPostsCount = async (
  filters: PostFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client.from('posts').select('id', { count: 'exact', head: true });

  if (filters.author_id) {
    query = query.eq('author_id', filters.author_id);
  }

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const getPost = async (id: string): Promise<null | Post> => {
  const postSBClient = useSupabaseClient();

  const { data, error } = await postSBClient
    .from('posts')
    .select(
      `
    *,
    author:author_id(*),
    tags:post_tags(tag:tag_id(*))
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createPost = async (post: PostInsert): Promise<Post> => {
  const postSBClient = useSupabaseClient();

  const { data, error } = await postSBClient
    .from('posts')
    .insert(post)
    .select(
      `
    *,
    author:author_id(*),
    tags:post_tags(tag:tag_id(*))
    `
    )
    .single();

  if (error) throw error;

  return data;
};

export const updatePost = async (
  id: string,
  updates: PostUpdate
): Promise<Post> => {
  const postSBClient = useSupabaseClient();

  const { data, error } = await postSBClient
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select(
      `
    *,
    author:author_id(*),
    tags:post_tags(tag:tag_id(*))
    `
    )
    .single();

  if (error) throw error;

  return data;
};

export const deletePost = async (id: string): Promise<void> => {
  const postSBClient = useSupabaseClient();

  const { error } = await postSBClient.from('posts').delete().eq('id', id);

  if (error) throw error;
};
