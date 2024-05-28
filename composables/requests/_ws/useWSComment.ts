import type { UseWebSocketReturn } from "@vueuse/core";
import destr from "destr";
import { WSConfig } from "~/configs";

/* eslint-disable no-unused-vars */
export type OnWSCommentStore = (ws: WebSocket, comment: CommentFull) => void;
export type OnWSCommentUpdate = (ws: WebSocket, comment: CommentFull) => void;
export type OnWSCommentDestroy = (ws: WebSocket, commentId: string) => void;
/* eslint-enable no-unused-vars */

export const useWSComment = (payload: {
  useWSReturn: UseWebSocketReturn<unknown>;
  onCommentStore?: OnWSCommentStore;
  onCommentUpdate?: OnWSCommentUpdate;
  onCommentDestroy?: OnWSCommentDestroy;
  // articleId: MaybeRefOrGetter<string>;
}) => {
  const {
    onCommentStore,
    onCommentUpdate,
    onCommentDestroy /* articleId */,
    useWSReturn,
  } = payload;

  // const commentId = ref<string>("");

  // const { commentFull, execute: fetchComment } = useShowComment({
  //   param: () => ({
  //     id: commentId.value,
  //   }),
  //   immediate: false,
  // });

  // eslint-disable-next-line no-unused-vars
  type EventHandler = (ws: WebSocket, data: WSCommentData) => void;

  const handleStoreEvent: EventHandler = async (
    ws: WebSocket,
    data: WSCommentData,
  ) => {
    onCommentStore?.(ws, data.comment);
  };

  const handleUpdateEvent: EventHandler = async (
    ws: WebSocket,
    data: WSCommentData,
  ) => {
    onCommentUpdate?.(ws, data.comment);
  };

  const handleDestroyEvent: EventHandler = (
    ws: WebSocket,
    data: WSCommentData,
  ) => {
    onCommentDestroy?.(ws, data.comment.id);
  };

  const eventHandlers: Record<WSCommentMessageEventType, EventHandler> = {
    destroy: handleDestroyEvent,
    store: handleStoreEvent,
    update: handleUpdateEvent,
  };

  watch(useWSReturn.data, async (newValue) => {
    if (newValue !== WSConfig.PONG_DEFAULT_VALUE) {
      const parsed = WSCommentDataSchema.parse(destr(newValue));

      await eventHandlers[parsed.eventType](useWSReturn.ws.value!, parsed);
    }
  });
};
