import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type { View, ViewFilters, ViewInsert, ViewUpdate } from './view.model';

import { ViewConfig } from './view.config';

export const getViews = async (
  filters: ViewFilters
): Promise<PaginationResult<View>> => {
  const client = useSupabaseClient();

  let query = client.from('views').select(
    `
    *,
    user:user_id(*)
    `,
    { count: 'exact' }
  );

  if (filters.post_id) {
    query = query.eq('post_id', filters.post_id);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const page = filters.page ?? ViewConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? ViewConfig.PAGE_SIZE_DEFAULT;
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

export const getViewsCount = async (
  filters: ViewFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client.from('views').select('id', { count: 'exact', head: true });

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

export const getView = async (id: string): Promise<null | View> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('views')
    .select(
      `
    *,
    user:user_id(*)
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createView = async (view: ViewInsert): Promise<View> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('views')
    .insert(view)
    .select(
      `
    *,
    user:user_id(*)
    `
    )
    .single();

  if (error) throw error;

  return data;
};

export const updateView = async (
  id: string,
  updates: ViewUpdate
): Promise<View> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('views')
    .update(updates)
    .eq('id', id)
    .select(
      `
    *,
    user:user_id(*)
    `
    )
    .single();

  if (error) throw error;

  return data;
};

export const deleteView = async (id: string): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client.from('views').delete().eq('id', id);

  if (error) throw error;
};
