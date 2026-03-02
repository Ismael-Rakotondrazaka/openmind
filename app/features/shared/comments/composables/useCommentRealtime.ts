import type { InfiniteData } from '@tanstack/vue-query';

import type { PaginationResult } from '~/features/shared/paginations/pagination.model';

import type { Comment, CommentFilters } from '../comment.model';

type BroadcastInsertPayload = {
  payload: {
    record: { id: string; parent_id: null | string; post_id: string };
  };
};

const prependCommentToCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  comment: Comment
) => {
  queryClient.setQueriesData<InfiniteData<PaginationResult<Comment>>>(
    {
      predicate: query => {
        const keyFilters = query.queryKey[1] as CommentFilters | undefined;
        return (
          keyFilters?.post_id === comment.post_id &&
          keyFilters?.parent_id === comment.parent_id
        );
      },
      queryKey: ['comments'],
    },
    old => {
      if (!old) return old;
      const alreadyPresent = old.pages.some(p =>
        p.data.some(c => c.id === comment.id)
      );
      if (alreadyPresent) return old;
      return {
        ...old,
        pages: old.pages.map((page, i) =>
          i === 0 ? { ...page, data: [comment, ...page.data] } : page
        ),
      };
    }
  );
};

export const useCommentRealtime = (postId: MaybeRefOrGetter<string>) => {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  onMounted(() => {
    const id = toValue(postId);

    const channel = supabase
      .channel(`post:${id}:comments`, { config: { private: true } })
      .on(
        'broadcast',
        { event: 'INSERT' },
        async (message: BroadcastInsertPayload) => {
          const record = message.payload?.record;
          if (!record?.id) return;

          const { data } = await supabase
            .from('comments')
            .select('*, author:author_id(*)')
            .eq('id', record.id)
            .maybeSingle();

          if (data) {
            prependCommentToCache(queryClient, data as unknown as Comment);
          }
          queryClient.invalidateQueries({ queryKey: ['post', id] });
        }
      )
      .on('broadcast', { event: 'UPDATE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
        queryClient.invalidateQueries({ queryKey: ['post', id] });
      })
      .on('broadcast', { event: 'DELETE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
        queryClient.invalidateQueries({ queryKey: ['post', id] });
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeChannel(channel);
    });
  });
};
