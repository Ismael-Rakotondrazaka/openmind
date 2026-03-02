import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type { Tag, TagFilters, TagInsert, TagUpdate } from './tag.model';

import { TagConfig } from './tag.config';

export const getTags = async (
  filters: TagFilters
): Promise<PaginationResult<Tag>> => {
  const client = useSupabaseClient();

  let query = client.from('tags').select('*', { count: 'exact' });

  if (filters.search) {
    query = query.ilike('value', `%${filters.search}%`);
  }

  const page = filters.page ?? TagConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? TagConfig.PAGE_SIZE_DEFAULT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order('value').range(from, to);

  const { count, data, error } = await query;

  if (error) throw error;

  return {
    count: count ?? 0,
    data: data ?? [],
  };
};

export const getTagsCount = async (
  filters: TagFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client.from('tags').select('id', { count: 'exact', head: true });

  if (filters.search) {
    query = query.ilike('value', `%${filters.search}%`);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};

export const getTag = async (id: string): Promise<null | Tag> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('tags')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createTag = async (tag: TagInsert): Promise<Tag> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('tags')
    .insert(tag)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateTag = async (
  id: string,
  updates: TagUpdate
): Promise<Tag> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('tags')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteTag = async (id: string): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client.from('tags').delete().eq('id', id);

  if (error) throw error;
};
