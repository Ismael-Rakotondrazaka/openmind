import {
  type Comment,
  CommentConfig,
  WsCommentMessageType,
} from '#shared/features/comments';
import { SortOrder } from '#shared/utils/enums';
import { WsEvent } from '#shared/utils/ws';

import { getComments } from '../comment.service';

export const useCommentList = (
  postId: MaybeRefOrGetter<string>,
  parentId?: MaybeRefOrGetter<string | undefined>
) => {
  const comments = ref<Serialize<Comment>[]>([]);
  const count = ref(0);
  const page = ref(1);
  const isLoading = ref(true);
  const isLoadingMore = ref(false);
  const fetchFn = useRequestFetch();
  const { data: wsData } = useGlobalWs();

  const hasMore = computed(() => comments.value.length < count.value);

  const fetchPage = async (p: number) => {
    return getComments(
      {
        page: p,
        pageSize: CommentConfig.PAGE_SIZE_DEFAULT,
        parentId: toValue(parentId) ?? undefined,
        postId: toValue(postId),
        sortOrder: SortOrder.desc,
      },
      fetchFn
    );
  };

  onMounted(async () => {
    const result = await fetchPage(1);
    count.value = result.count;
    comments.value = [...result.data].reverse();
    isLoading.value = false;
  });

  const loadPrevious = async () => {
    isLoadingMore.value = true;
    page.value++;
    const result = await fetchPage(page.value);
    count.value = result.count;
    comments.value = [...[...result.data].reverse(), ...comments.value];
    isLoadingMore.value = false;
  };

  watch(wsData, raw => {
    if (!raw || raw === 'pong') return;
    try {
      const msg = JSON.parse(raw as string) as {
        event: WsEvent;
        record: Serialize<Comment>;
        type?: string;
      };
      if (msg.type !== WsCommentMessageType) return;

      const { event, record } = msg;
      const pid = toValue(parentId);

      if (pid ? record.parentId !== pid : !!record.parentId) return;

      if (event === WsEvent.INSERT) {
        if (comments.value.some(c => c.id === record.id)) return;
        comments.value = [...comments.value, record];
        count.value++;
      } else if (event === WsEvent.UPDATE) {
        comments.value = comments.value.map(c =>
          c.id === record.id
            ? { ...c, content: record.content, updatedAt: record.updatedAt }
            : c
        );
      } else if (event === WsEvent.DELETE) {
        comments.value = comments.value.filter(c => c.id !== record.id);
        count.value--;
      }
    } catch {
      // ignore malformed messages
    }
  });

  return { comments, count, hasMore, isLoading, isLoadingMore, loadPrevious };
};
