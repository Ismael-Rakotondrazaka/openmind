import type { WsEvent } from '../../utils/ws';
import type { Comment } from './comment.model';

export const WsCommentMessageType = 'comment' as const;

export const commentsTopic = (postId: string) => `post:${postId}:comments`;

export type WsCommentMessage = {
  event: WsEvent;
  record: Comment;
  type: typeof WsCommentMessageType;
};
