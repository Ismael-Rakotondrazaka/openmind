import { commentsTopic } from '#shared/features/comments';
import { WsControl } from '#shared/utils/ws';

export const useCommentRealtime = (postId: MaybeRefOrGetter<string>) => {
  const { send } = useGlobalWs();
  const id = toValue(postId);
  const topic = commentsTopic(id);

  onMounted(() => send(JSON.stringify({ topic, type: WsControl.SUBSCRIBE })));
  onUnmounted(() =>
    send(JSON.stringify({ topic, type: WsControl.UNSUBSCRIBE }))
  );
};
