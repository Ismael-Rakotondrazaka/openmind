import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../../../types/database/schema.ts';
import type { Post, PostInsert } from './post.model.ts';

export const createPost = async (
  supabase: SupabaseClient<Database>,
  insertData: PostInsert
): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select(
      `
      *
      `
    )
    .single();

  if (error) throw error;

  return data;
};
