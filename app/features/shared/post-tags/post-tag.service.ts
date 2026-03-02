import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type { PostTag, PostTagFilters, PostTagInsert } from './post-tag.model';

import { PostTagConfig } from './post-tag.config';

export const getPostTags = async (
  filters: PostTagFilters
): Promise<PaginationResult<PostTag>> => {
  const client = useSupabaseClient();

  let query = client.from('post_tags').select('*', { count: 'exact' });

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  if (filters.tag_id) {
    query = query.eq('tag_id', filters.tag_id);
  }

  const page = filters.page ?? PostTagConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? PostTagConfig.PAGE_SIZE_DEFAULT;
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

export const getPostTagsCount = async (
  filters: PostTagFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client
    .from('post_tags')
    .select('post_id', { count: 'exact', head: true });

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  if (filters.tag_id) {
    query = query.eq('tag_id', filters.tag_id);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const createPostTag = async (
  postTag: PostTagInsert
): Promise<PostTag> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('post_tags')
    .insert(postTag)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deletePostTag = async (
  postId: string,
  tagId: string
): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client
    .from('post_tags')
    .delete()
    .eq('post_id', postId)
    .eq('tag_id', tagId);

  if (error) throw error;
};
