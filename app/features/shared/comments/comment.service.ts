import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type {
  Comment,
  CommentFilters,
  CommentInsert,
  CommentUpdate,
} from './comment.model';

import { CommentConfig } from './comment.config';

export const getComments = async (
  filters: CommentFilters
): Promise<PaginationResult<Comment>> => {
  const client = useSupabaseClient();

  let query = client.from('comments').select(
    `
    *,
    author:author_id(*)
    `,
    { count: 'exact' }
  );

  if (filters.author_id) {
    query = query.eq('author_id', filters.author_id);
  }

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  if (filters.depth !== undefined) {
    query = query.eq('depth', filters.depth);
  }

  if ('parent_id' in filters) {
    if (filters.parent_id === null) {
      query = query.is('parent_id', null);
    } else if (filters.parent_id) {
      query = query.eq('parent_id', filters.parent_id);
    }
  }

  const limit = filters.limit ?? CommentConfig.PAGE_SIZE_DEFAULT;

  if (filters.before) {
    query = query.lt('created_at', filters.before);
  }

  query = query
    .order(filters.orderBy ?? 'created_at', {
      ascending:
        filters.sortOrder !== undefined
          ? filters.sortOrder === SortOrder.asc
          : true,
    })
    .limit(limit);

  const { count, data, error } = await query;

  if (error) throw error;

  return {
    count: count ?? 0,
    data: (data ?? []) as unknown as Comment[],
  };
};

export const getCommentsCount = async (
  filters: CommentFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client
    .from('comments')
    .select('id', { count: 'exact', head: true });

  if (filters.author_id) {
    query = query.eq('author_id', filters.author_id);
  }

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const getComment = async (id: string): Promise<Comment | null> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('comments')
    .select(
      `
    *,
    author:author_id(*)
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data as unknown as Comment | null;
};

export const createComment = async (
  comment: CommentInsert
): Promise<Comment> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('comments')
    .insert(comment)
    .select(
      `
    *,
    author:author_id(*)
    `
    )
    .single();

  if (error) throw error;

  return data as unknown as Comment;
};

export const updateComment = async (
  id: string,
  updates: CommentUpdate
): Promise<Comment> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('comments')
    .update(updates)
    .eq('id', id)
    .select(
      `
    *,
    author:author_id(*)
    `
    )
    .single();

  if (error) throw error;

  return data as unknown as Comment;
};

export const deleteComment = async (id: string): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client.from('comments').delete().eq('id', id);

  if (error) throw error;
};
