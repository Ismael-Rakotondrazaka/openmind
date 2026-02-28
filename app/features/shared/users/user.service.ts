import type { PaginationResult } from '@/features/shared/paginations/pagination.model';

import type { User, UserFilters, UserUpdate } from './user.model';

import { UserConfig } from './user.config';

export const getUsers = async (
  filters: UserFilters
): Promise<PaginationResult<User>> => {
  const client = useSupabaseClient();

  let query = client.from('users').select('*', { count: 'exact' });

  if (filters.role) {
    query = query.eq('role', filters.role);
  }

  if (filters.username) {
    query = query.eq('username', filters.username);
  }

  if (filters.search) {
    query = query.or(
      `username.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`
    );
  }

  const page = filters.page ?? UserConfig.PAGE_DEFAULT;
  const limit = filters.limit ?? UserConfig.PAGE_SIZE_DEFAULT;
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

export const getUser = async (id: string): Promise<null | User> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const getUsernames = async ({
  limit,
  username,
}: {
  limit?: number;
  username?: string;
}): Promise<PaginationResult<string>> => {
  const userSBClient = useSupabaseClient();

  let query = userSBClient.from('users').select('username');

  if (username) {
    query = query.eq('username', username);
  }

  query = query.limit(limit ?? UserConfig.PAGE_SIZE_DEFAULT);

  const { count, data, error } = await query;

  if (error) {
    throw error;
  }

  return {
    count: count ?? 0,
    data: data.reduce((acc, user) => {
      if (user.username) {
        acc.push(user.username);
      }
      return acc;
    }, [] as string[]),
  };
};

export const isUsernameExists = async ({
  username,
}: {
  username: string;
}): Promise<boolean> => {
  const userSBClient = useSupabaseClient();

  const { data, error } = await userSBClient
    .from('users')
    .select('username')
    .eq('username', username)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
};

export const updateUser = async (
  id: string,
  updates: UserUpdate
): Promise<User> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getUsersCount = async (
  filters: UserFilters = {}
): Promise<number> => {
  const client = useSupabaseClient();

  let query = client.from('users').select('id', { count: 'exact', head: true });

  if (filters.role) {
    query = query.eq('role', filters.role);
  }

  if (filters.username) {
    query = query.eq('username', filters.username);
  }

  if (filters.search) {
    query = query.or(
      `username.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`
    );
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
};
